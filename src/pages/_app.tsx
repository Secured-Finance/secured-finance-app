import * as amplitude from '@amplitude/analytics-browser';
import { pageViewTrackingPlugin } from '@amplitude/plugin-page-view-tracking-browser';
// COMMENTED OUT: Points client temporarily disabled
// import {
//     ApolloClient,
//     ApolloProvider,
//     InMemoryCache,
//     createHttpLink,
// } from '@apollo/client';
// import { setContext } from '@apollo/client/link/context';
import { NextUIProvider } from '@nextui-org/system';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Script from 'next/script';
import { useEffect } from 'react';
import { CookiesProvider } from 'react-cookie';
import { Provider } from 'react-redux';
import 'src/bigIntPatch';
import { Footer } from 'src/components/atoms';
import { Layout } from 'src/components/templates';
import SecuredFinanceProvider from 'src/contexts/SecuredFinanceProvider';
import store from 'src/store';
import {
    getAmplitudeApiKey,
    getGoogleAnalyticsTag,
    getSupportedChainIds,
    getSupportedNetworks,
    getWalletConnectId,
} from 'src/utils';
import * as gtag from 'src/utils/gtag';
import { WagmiConfig, configureChains, createConfig } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { MetaMaskConnector } from 'wagmi/connectors/metaMask';
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc';
import { publicProvider } from 'wagmi/providers/public';
import '../assets/css/index.css';

const Header = dynamic(() => import('src/components/organisms/Header/Header'), {
    ssr: false,
});

const gaTag = getGoogleAnalyticsTag();

const projectId = getWalletConnectId();

const queryClient = new QueryClient();

const TrackingCode = ({ gaTag }: { gaTag: string }) => {
    return (
        <>
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${gaTag}`}
            />
            <Script id='google-analytics' strategy='afterInteractive'>
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${gaTag}');
                    window.addEventListener('hashchange', () => {
                        gtag('config', '${gaTag}', {
                            page_path: window.location.pathname + window.location.hash,
                        });
                    });
                    `}
            </Script>
        </>
    );
};

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

const ankrNetworkKeys: Record<string, string> = {
    '314159': 'filecoin_testnet',
    '314': 'filecoin',
};

const { chains, publicClient } = configureChains(
    networks,
    [
        alchemyProvider({
            apiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY ?? '',
        }),
        jsonRpcProvider({
            rpc: chain => {
                const chainId = chain.id.toString();
                if (
                    process.env.NEXT_PUBLIC_ANKR_API_KEY &&
                    Object.keys(ankrNetworkKeys).includes(chainId)
                ) {
                    return {
                        http: `https://rpc.ankr.com/${ankrNetworkKeys[chainId]}/${process.env.NEXT_PUBLIC_ANKR_API_KEY}`,
                    };
                } else {
                    return null;
                }
            },
        }),
        publicProvider(),
    ],
    { pollingInterval: 12_000 }
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

// COMMENTED OUT: Points client temporarily disabled
// const httpLink = createHttpLink({
//     uri: getGraphqlServerUrl(),
// });

// const authLink = setContext((_, { headers }) => {
//     const token = new Cookies().get('verified_data')?.token;
//     return {
//         headers: {
//             ...headers,
//             authorization: token ? `Bearer ${token}` : '',
//         },
//     };
// });

function App({ Component, pageProps }: AppProps) {
    const router = useRouter();

    useEffect(() => {
        const handleRouteChange = (url: string) => {
            gtag.pageView(url, gaTag);
        };

        router.events.on('routeChangeComplete', handleRouteChange);
        return () => {
            router.events.off('routeChangeComplete', handleRouteChange);
        };
    }, [router.events]);

    return (
        <>
            <Head>
                <title>DeFi Lending Platform | Secured Finance</title>
                <meta
                    name='viewport'
                    content='width=device-width, initial-scale=1.0'
                />
            </Head>
            {gaTag && <TrackingCode gaTag={gaTag} />}
            <Provider store={store}>
                <Providers>
                    <Layout
                        isCampaignPage={router.pathname.includes('campaign')}
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
    // COMMENTED OUT: Points client temporarily disabled
    // const client = useMemo(() => {
    //     return new ApolloClient({
    //         link: authLink.concat(httpLink), // Only points client endpoint
    //         cache: new InMemoryCache(),
    //     });
    // }, []);

    return (
        <CookiesProvider>
            <NextUIProvider>
                <QueryClientProvider client={queryClient}>
                    {/* COMMENTED OUT: ApolloProvider temporarily disabled */}
                    {/* <ApolloProvider client={client}> */}
                    <WagmiConfig config={config}>
                        <SecuredFinanceProvider>
                            {children}
                        </SecuredFinanceProvider>
                    </WagmiConfig>
                    {/* </ApolloProvider> */}
                    <ReactQueryDevtools initialIsOpen={false} />
                </QueryClientProvider>
            </NextUIProvider>
        </CookiesProvider>
    );
};

export default App;
