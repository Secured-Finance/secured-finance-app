import * as amplitude from '@amplitude/analytics-browser';
import { pageViewTrackingPlugin } from '@amplitude/plugin-page-view-tracking-browser';
import {
    ApolloClient,
    ApolloProvider,
    InMemoryCache,
    createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { NextUIProvider } from '@nextui-org/system';
import { GraphClientProvider } from '@secured-finance/sf-graph-client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { Cookies, CookiesProvider } from 'react-cookie';
import { Provider, useSelector } from 'react-redux';
import 'src/bigIntPatch';
import { Footer } from 'src/components/atoms';
import { Layout } from 'src/components/templates';
import SecuredFinanceProvider from 'src/contexts/SecuredFinanceProvider';
import store from 'src/store';
import { selectNetworkName } from 'src/store/blockchain';
import { RootState } from 'src/store/types';
import {
    getAmplitudeApiKey,
    getGraphqlServerUrl,
    getSupportedChainIds,
    getSupportedNetworks,
    getWalletConnectId,
} from 'src/utils';
import { WagmiConfig, configureChains, createConfig } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';
import '../assets/css/index.css';

const Header = dynamic(() => import('src/components/organisms/Header/Header'), {
    ssr: false,
});

const projectId = getWalletConnectId();

const queryClient = new QueryClient();

if (typeof window !== 'undefined') {
    const pageViewTracking = pageViewTrackingPlugin({
        trackOn: undefined,
        trackHistoryChanges: undefined,
    });

    amplitude.add(pageViewTracking);
    amplitude.init(getAmplitudeApiKey(), {
        appVersion: process.env.SF_ENV,
        logLevel: amplitude.Types.LogLevel.None,
    });
}

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
                        '--w3m-font-family':
                            "'Suisse International', sans-serif",
                        '--w3m-accent-color': '#002133',
                        '--w3m-background-color': '#5162FF',
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

const httpLink = createHttpLink({
    uri: getGraphqlServerUrl(),
});

const authLink = setContext((_, { headers }) => {
    const token = new Cookies().get('sign_in_data')?.token;
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
        },
    };
});

const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});

function App({ Component, pageProps }: AppProps) {
    const router = useRouter();
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
                    <Layout
                        navBar={
                            <Header
                                showNavigation={
                                    router.pathname !== '/emergency'
                                }
                            />
                        }
                        footer={<Footer />}
                    >
                        <Component {...pageProps} />
                    </Layout>
                </Providers>
            </Provider>
        </>
    );
}

const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const currentNetwork = useSelector((state: RootState) =>
        selectNetworkName(state)
    );

    return (
        <CookiesProvider>
            <NextUIProvider>
                <QueryClientProvider client={queryClient}>
                    <GraphClientProvider network={currentNetwork}>
                        <ApolloProvider client={client}>
                            <WagmiConfig config={config}>
                                <SecuredFinanceProvider>
                                    {children}
                                </SecuredFinanceProvider>
                            </WagmiConfig>
                        </ApolloProvider>
                    </GraphClientProvider>
                    <ReactQueryDevtools initialIsOpen={false} />
                </QueryClientProvider>
            </NextUIProvider>
        </CookiesProvider>
    );
};

export default App;
