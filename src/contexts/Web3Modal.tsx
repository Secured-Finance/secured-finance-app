'use client';

import { EIP6963Connector } from '@web3modal/wagmi';
import { createWeb3Modal } from '@web3modal/wagmi/react';

import {
    getSupportedChainIds,
    getSupportedNetworks,
    getWalletConnectId,
} from 'src/utils';
import { WagmiConfig, configureChains, createConfig } from 'wagmi';
import { CoinbaseWalletConnector } from 'wagmi/connectors/coinbaseWallet';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

const projectId = getWalletConnectId();

const chainIds = getSupportedChainIds();
const networks = getSupportedNetworks().filter(chain =>
    chainIds.includes(chain.id)
);

const { chains, publicClient } = configureChains(networks, [
    alchemyProvider({
        apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY ?? '',
    }),
    publicProvider(),
]);

const metadata = {
    name: 'Secured Finance',
    description:
        'A DeFi Trading Platform utilizing Orderbook-based Rates, facilitating the lending and borrowing of digital assets for constructing yield curves within the DeFi ecosystem.',
    url: 'https://app.secured.finance',
    icons: ['https://avatars.githubusercontent.com/u/68607377'],
};

const wagmiConfig = createConfig({
    autoConnect: true,
    connectors: [
        new WalletConnectConnector({
            chains,
            options: {
                projectId,
                showQrModal: false,
                metadata,
                qrModalOptions: {
                    themeVariables: {
                        '--wcm-font-family':
                            "'Suisse International', sans-serif",
                        '--wcm-accent-color': '#002133',
                        '--wcm-background-color': '#5162FF',
                    },
                },
            },
        }),
        new EIP6963Connector({ chains }),
        new InjectedConnector({ chains, options: { shimDisconnect: true } }),
        new CoinbaseWalletConnector({
            chains,
            options: { appName: metadata.name },
        }),
    ],
    publicClient,
});

createWeb3Modal({
    wagmiConfig,
    projectId,
    chains,
    enableAnalytics: true,
});

export function Web3Modal({ children }: { children: React.ReactNode }) {
    return <WagmiConfig config={wagmiConfig}>{children}</WagmiConfig>;
}
