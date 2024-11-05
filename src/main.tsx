import { MetaMaskProvider } from '@metamask/sdk-react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MetaMaskProvider
      debug={false}
      sdkOptions={{
        dappMetadata: {
          name: 'Ace on Base Sale Client',
          url: window.location.href,
        },
        // infuraAPIKey: process.env.INFURA_API_KEY,
        checkInstallationOnAllCalls: true,
        useDeeplink: true,
      }}
    >
      <App />
    </MetaMaskProvider>
  </StrictMode>
);
