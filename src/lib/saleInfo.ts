import { getStoreData } from './api';

export async function init() {
  try {
    const store: StoreDatata = {};
    const data = await getStoreData();
    const aceonData = data.Tokens.find(
      (item) => item.ProductID === 'FAceonBase1'
    );
    //const endDate = new Date(aceonData.SaleEnd * 1000);
    store.endDate = new Date(1730476800 * 1000);

    store.maxSupply = aceonData.MaxSupply;
    store.remaining = aceonData.Remaining;
    store.soldAmount =
      store.maxSupply - store.remaining + aceonData.AdditionalAccountedQuantity;
    store.remainingTokens = store.maxSupply - store.soldAmount;
    store.minimumPurchaseTokens = aceonData.MinPurchase;
    store.pricePerToken = aceonData.PriceInUSD;
    store.nextRoundPrice = 0.0002;

    store.ETHRate = data.EthConvertRate.Price;
    store.LOCGRate = data.LoCGConvertRate.Price;

    store.usdRaised = Math.floor(
      store.soldAmount * store.pricePerToken
    ).toLocaleString();
    store.usdGoal = Math.ceil(
      store.maxSupply * store.pricePerToken
    ).toLocaleString();

    return store;
  } catch (error) {
    console.error('Error initializing sale info:', error);
  }
}
