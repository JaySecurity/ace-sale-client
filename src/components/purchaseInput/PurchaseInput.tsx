import { useSDK } from '@metamask/sdk-react';
import { ChangeEvent } from 'react';
import { StoreData } from '../../lib/types';

interface Props {
  sendTx: () => void;
  storeData: StoreData;
  isVerified: boolean;
  paymentType: string;
  setMethod: (s: string) => void;
  qty: number;
  setQty: (n: number) => void;
  tokenQty: number;
}
const PurchaseInput = ({
  sendTx,
  storeData,
  isVerified,
  paymentType,
  setMethod,
  qty,
  setQty,
  tokenQty,
}: Props) => {
  const { sdk, connecting } = useSDK();

  const connect = async () => {
    try {
      await sdk?.connect();
      // if (accounts && accounts?.length > 0) {
      //   accountSet(accounts?.[0]);
      // }
    } catch (err) {
      console.log(err);
    }
  };

  const handleMethodChanged = (e: ChangeEvent<HTMLSelectElement>) => {
    if (!e) return;
    setMethod(e?.target?.value);
  };

  const handleQtyChange = (e: ChangeEvent<HTMLInputElement>) => {
    const val = e?.target?.value;
    if (val === '') {
      setQty(0);
    } else if (!isNaN(parseFloat(val))) {
      setQty(parseFloat(val));
    }
  };

  return (
    <>
      <p className='cprice'>
        1 $ACEON = <span id='currentPrice'>{storeData?.pricePerToken}</span>{' '}
        $USD
      </p>
      <p className='minpur'>Minimum purchase amount - 10 $USD</p>
      <div className='payment-section'>
        <select
          id='cryptoSelect'
          className='cryptoSelect'
          onChange={handleMethodChanged}
          value={paymentType}
        >
          <option value='USDT'>$USDT eth</option>
          <option value='USDC'>$USDC base</option>
          <option value='ETH'>$ETH mainnet</option>
          <option value='wETH'>wETH base</option>
          <option value='LOCG_eth'>$LOCG eth mainnet</option>
          <option value='LOCG_base'>$LOCG base</option>
        </select>
        <input
          type='number'
          id='cryptoAmount'
          className='cryptoAmount'
          placeholder='Amount'
          value={qty}
          onChange={handleQtyChange}
        />
      </div>
      <p id='aceonYouGet' className='aceonYouGet'>
        ACEON YOU GET: {tokenQty}
      </p>
      {isVerified ? (
        <button id='buyButton' className='buyButton' onClick={sendTx}>
          BUY $ACEON
        </button>
      ) : (
        <button
          id='connectWalletButton'
          className='connectWalletButton'
          onClick={connect}
        >
          {connecting ? 'Connecting' : 'Connect MetaMask'}
        </button>
      )}
    </>
  );
};

export default PurchaseInput;
