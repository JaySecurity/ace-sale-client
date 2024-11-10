import { getStoreData } from './api';
import { StoreData, Token } from './types';

export async function init() {
  try {
    const store: StoreData = {
      maxSupply: 0,
      remaining: 0,
      soldAmount: 0,
      remainingTokens: 0,
      minimumPurchaseTokens: 0,
      pricePerToken: 0,
      nextRoundPrice: 0,
      ETHRate: 0,
      LOCGRate: 0,
      usdRaised: '',
      usdGoal: '',
      endDate: new Date(),
    };
    const data = await getStoreData();
    const aceonData = data.Tokens.find(
      (item: Token) => item.ProductID === 'FAceonBase1'
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
