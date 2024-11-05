import { metamask_batch } from '@metamask/sdk';
import { useSDK } from '@metamask/sdk-react';
import { useEffect, useState } from 'react';
import CodeInput from './components/codeInput/CodeInput';
import EmailInput from './components/emailInput/EmailInput';
import PurchaseInput from './components/purchaseInput/PurchaseInput';
import TopSection from './components/topSection/TopSection';
import { createOrder, getGasData, verifyEmail } from './lib/api';
import chains from './lib/chains.json';
import { init } from './lib/saleInfo';
import { OrderResponse, StoreData } from './lib/types';

const App = () => {
  const payments = {
    LOCG_eth: 2,
    LOCG_base: 3,
    ETH: 4,
    // PayPal: 5,
    USDC: 7,
    USDT: 8,
    wETH: 9,
  };

  const { provider, account, chainId } = useSDK();
  const [isVerified, isVerifiedSet] = useState<boolean>(false);
  const [codeSent, codeSentSet] = useState<boolean>(false);
  const [showPurchase, showPurchaseSet] = useState<boolean>(true);
  const [email, emailSet] = useState<string>('');
  const [code, codeSet] = useState<string>('');
  const [storeData, storeDataSet] = useState<StoreData>();
  const [qty, qtySet] = useState<number>();
  const [paymentMethod, paymentMethodSet] = useState('USDT');
  const [tokenQty, tokenQtySet] = useState(0);

  useEffect(() => {
    init().then((data) => {
      storeDataSet(data);
    });
  }, []);

  useEffect(() => {
    if ((!account && !isVerified) || isVerified) {
      showPurchaseSet(true);
    } else {
      showPurchaseSet(false);
    }
  }, [account, isVerified]);

  useEffect(() => {
    if (!code || !account) return;
    verifyEmail(email, code, account).then(() => {
      isVerifiedSet(true);
    });
  }, [code]);

  useEffect(() => {
    const parsedQty = Number(qty);
    if (parsedQty <= 0 || isNaN(parsedQty)) return;
    const tokenAmt = calculateTokenAmount();
    tokenQtySet(tokenAmt);
  }, [qty, paymentMethod]);

  function stringToHex(val: string): string | undefined {
    return val ? `0x${parseInt(val).toString(16)}` : undefined;
  }

  function calculateTokenAmount() {
    if (!storeData) return 0;
    const cryptoAmount = qty || 0;
    const cryptoType = paymentMethod;
    const pricePerToken = storeData.pricePerToken;

    let usdEquivalent;
    switch (cryptoType) {
      case 'USDT':
      case 'USDC':
        usdEquivalent = cryptoAmount;
        break;
      case 'wETH':
      case 'ETH':
        usdEquivalent = cryptoAmount / storeData.ETHRate;
        break;
      case 'LOCG_eth':
      case 'LOCG_base':
        usdEquivalent = cryptoAmount / storeData.LOCGRate;
        break;
      default:
        usdEquivalent = 0;
    }

    const aceonAmount = Math.round(usdEquivalent / pricePerToken);

    return aceonAmount;
  }

  const sendTx = async () => {
    if (!provider) {
      console.log('Provider Not Found');
      return;
    }
    try {
      const batchRequests = [];
      const order: Promise<OrderResponse> = await createOrder(
        tokenQty,
        payments[paymentMethod]
      );
      if (chainId !== stringToHex(order.ChainID)) {
        const hexId = `0x${parseInt(order.ChainID).toString(16)}`;

        batchRequests.push({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: hexId }],
        });
      }
      const params = {
        from: account,
        to: order.To,
        value: order?.Value || 0,
        data: order.CallData,
        maxPriorityFeePerGas: '',
        maxFeePerGas: '',
      };
      const gasData = await getGasData();
      // params.gas = await estimateGas(params);
      params.maxFeePerGas = gasData.maxFeePerGas;
      params.maxPriorityFeePerGas = gasData.maxPriorityFeePerGas;
      batchRequests.push({
        method: 'eth_sendTransaction',
        params: [params],
      });
      const txHash = await metamask_batch(batchRequests);
      console.log(txHash);
    } catch (err) {
      if (
        err instanceof Error &&
        err?.message.includes('Unrecognized chain ID ')
      ) {
        await provider.request({
          method: 'wallet_addEthereumChain',
          params: [{ ...chains[order.ChainID] }],
        });
      }
    }
  };

  return (
    <div className='app'>
      <div className='logo'>
        <img
          src='https://cdn.prod.website-files.com/6616403cebb1b03d5009fea9/66c75c6ab09d241ea653066d_LOGO%20navbar.svg'
          alt='Logo'
        />
      </div>
      <div className='widget'>
        <TopSection storeData={storeData} />
        <div className='bottom-section' id='purchaseSection'>
          {showPurchase && (
            <PurchaseInput
              sendTx={sendTx}
              storeData={storeData}
              isVerified={isVerified}
              paymentType={paymentMethod}
              setMethod={paymentMethodSet}
              qty={qty}
              setQty={qtySet}
              tokenQty={tokenQty}
            />
          )}
          {account && !isVerified && (
            <>
              {codeSent ? (
                <CodeInput setCode={codeSet} setCodeSent={codeSentSet} />
              ) : (
                <EmailInput
                  setEmail={emailSet}
                  setCodeSent={codeSentSet}
                  wallet={account}
                />
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
