import { init } from '@amplitude/analytics-browser';
import { LogLevel } from '@amplitude/analytics-types';
import { GraphClientProvider } from '@secured-finance/sf-graph-client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { Provider } from 'react-redux';
import { Footer } from 'src/components/atoms';
import { Header } from 'src/components/organisms';
import { Layout } from 'src/components/templates';
import SecuredFinanceProvider from 'src/contexts/SecuredFinanceProvider';
import store from 'src/store';
import {
    getAmplitudeApiKey,
    getEthereumNetwork,
    getWalletConnectId,
} from 'src/utils';
import { WagmiConfig, configureChains, createConfig, sepolia } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import '../assets/css/index.css';

// // eslint-disable-next-line @typescript-eslint/no-explicit-any
// (BigInt.prototype as any).toJSON = function () {
//     return this.toString();
// };

// Object.defineProperty(BigInt.prototype, 'toJSON', {
//     get() {
//         'use strict';
//         return () => String(this);
//     },
// });

const projectId = getWalletConnectId();

const queryClient = new QueryClient();

init(getAmplitudeApiKey(), undefined, {
    appVersion: process.env.SF_ENV,
    logLevel: LogLevel.None,
});

const { chains, publicClient } = configureChains(
    [sepolia],
    [
        alchemyProvider({
            apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY ?? '',
        }),
        publicProvider(),
    ]
);

const config = createConfig({
    autoConnect: false,
    publicClient: publicClient,
    connectors: [
        new MetaMaskConnector({ chains }),
        new WalletConnectConnector({
            chains,
            options: {
                projectId: projectId,
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
        new InjectedConnector({
            chains,
            options: {
                name: 'Injected',
                shimDisconnect: true,
            },
        }),
    ],
});

function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <Head>
                <title>Secured Finance</title>
                <meta
                    name='viewport'
                    content='width=device-width, initial-scale=1.0'
                />
            </Head>

            <Provider store={store}>
                <Providers>
                    <Layout navBar={<Header />} footer={<Footer />}>
                        <Component {...pageProps} />
                    </Layout>
                </Providers>
            </Provider>
        </>
    );
}

const Providers: React.FC = ({ children }) => {
    const network = getEthereumNetwork();

    return (
        <QueryClientProvider client={queryClient}>
            <GraphClientProvider network={network}>
                <WagmiConfig config={config}>
                    <SecuredFinanceProvider>{children}</SecuredFinanceProvider>
                </WagmiConfig>
            </GraphClientProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
};

export default App;
