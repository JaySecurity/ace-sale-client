import { OrderResponse } from './types';

const BASE_URL = import.meta.env.VITE_BASE_URL;
const ENDPOINTS = {
  EMAIL_LOGIN: '/account/login/email',
  VERIFY_EMAIL: '/account/login/verifyemail',
  ORDER: '/order',
  STORE: '/store',
  GAS: '/payment/gas',
};
export async function getGasData() {
  const url = `${BASE_URL}${ENDPOINTS.GAS}`;
  const resp = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  });
  return resp.json();
}

export async function getStoreData() {
  const url = `${BASE_URL}${ENDPOINTS.STORE}`;
  const resp = await fetch(url, {
    method: 'GET',
    credentials: 'include',
  });
  const data = await resp.json();
  return data;
}

export async function connectWithEmail({ wallet = '', email = '' } = {}) {
  const url = `${BASE_URL}${ENDPOINTS.EMAIL_LOGIN}`;
  const body = JSON.stringify({
    Email: email,
    IsMetaMask: true,
    Wallet: wallet,
  });
  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept-Language': 'en-US',
      },
      credentials: 'include',
      body: body,
    });
    return await resp.json();
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    } else {
      console.log('Unknown error:', err);
    }
    throw err;
  }
}

export async function verifyEmail(email: string, code: string, wallet: string) {
  const session = `${email}|true|${wallet}`;
  const url = `${BASE_URL}${ENDPOINTS.VERIFY_EMAIL}`;
  const body = JSON.stringify({
    Email: email,
    ChallengeName: 'OTP_LOGIN',
    Code: code,
    Session: session,
  });
  try {
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body,
    });
    return await resp.json();
  } catch (err) {
    if (err instanceof Error) {
      console.log(err.message);
    } else {
      console.log('Unknown error:', err);
    }
    return err;
  }
}

export async function createOrder(
  quantity: number,
  paymentMethod: number
): Promise<OrderResponse> {
  console.log(`Qty: ${quantity} - Method: ${paymentMethod}`);
  const url = `${BASE_URL}${ENDPOINTS.ORDER}`;
  const body = {
    Quantity: quantity,
    ProductID: 'FAceonBase1',
    PaymentMethod: paymentMethod,
  };
  const resp = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
    body: JSON.stringify(body),
  });

  return resp.json();
}

export async function updateOrder(
  orderId: string,
  transactionHash: string
): Promise<void> {
  const url = `${BASE_URL}${ENDPOINTS.ORDER}`;
  const body = {
    OrderID: orderId,
    TransactionHash: transactionHash,
  };
  try {
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(body),
    });
    if (!response.ok) {
      throw new Error(`Failed to update order ${response.status}`);
    }
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.log(err.message);
    } else {
      console.log('Unknown error:', err);
    }
    throw err;
  }
}
