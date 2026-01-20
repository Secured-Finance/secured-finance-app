import * as amplitude from '@amplitude/analytics-browser';
import { pageViewTrackingPlugin } from '@amplitude/plugin-page-view-tracking-browser';
import {
    ApolloClient,
    ApolloLink,
    ApolloProvider,
    createHttpLink,
    InMemoryCache,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { NextUIProvider } from '@nextui-org/system';
import { GraphApolloClient } from '@secured-finance/sf-graph-client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/react';
import { AppProps } from 'next/app';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Script from 'next/script';
import { useEffect, useMemo } from 'react';
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
    getGoogleAnalyticsTag,
    getGraphqlServerUrl,
    getSubgraphUrl,
    getSupportedChainIds,
    getSupportedNetworks,
    getWalletConnectId,
} from 'src/utils';
import * as gtag from 'src/utils/gtag';
import { Chain } from 'viem/chains';
import { fallback, http, Transport, WagmiProvider } from 'wagmi';
import '../assets/css/index.css';

const Header = dynamic(() => import('src/components/organisms/Header/Header'), {
    ssr: false,
});

const gaTag = getGoogleAnalyticsTag();

const projectId = getWalletConnectId();

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

// Helper function to create transport for each chain
const createTransport = (chain: Chain): Transport => {
    const chainId = chain.id.toString();
    const transports: ReturnType<typeof http>[] = [];
    const alchemyKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY;
    const ankrKey = process.env.NEXT_PUBLIC_ANKR_API_KEY;

    // Alchemy provider (if API key exists)
    if (alchemyKey) {
        const alchemyUrls: Record<number, string> = {
            1: `https://eth-mainnet.g.alchemy.com/v2/${alchemyKey}`,
            11155111: `https://eth-sepolia.g.alchemy.com/v2/${alchemyKey}`,
            42161: `https://arb-mainnet.g.alchemy.com/v2/${alchemyKey}`,
            421614: `https://arb-sepolia.g.alchemy.com/v2/${alchemyKey}`,
            43114: `https://avax-mainnet.g.alchemy.com/v2/${alchemyKey}`,
            43113: `https://avax-fuji.g.alchemy.com/v2/${alchemyKey}`,
        };
        if (alchemyUrls[chain.id]) {
            transports.push(http(alchemyUrls[chain.id]));
        }
    }

    // Ankr provider (for Filecoin networks)
    if (ankrKey && Object.keys(ankrNetworkKeys).includes(chainId)) {
        transports.push(
            http(`https://rpc.ankr.com/${ankrNetworkKeys[chainId]}/${ankrKey}`)
        );
    }

    // Public provider (fallback)
    if (chain.rpcUrls.default.http[0]) {
        transports.push(http(chain.rpcUrls.default.http[0]));
    }

    // Use fallback if multiple transports, otherwise single transport
    return transports.length > 1
        ? fallback(transports)
        : transports[0] || http();
};

const metadata = {
    name: 'Secured Finance',
    description: 'DeFi Lending Platform | Secured Finance',
    url: 'https://app.secured.finance/', // origin must match your domain & subdomain
    icons: ['https://avatars.githubusercontent.com/u/37784886'],
};

const queryClient = new QueryClient();

export const wagmiConfig = defaultWagmiConfig({
    chains: networks as [Chain, ...Chain[]],
    projectId: projectId,
    metadata,
    ssr: true,
    auth: {
        email: false,
        socials: undefined,
        showWallets: true,
        walletFeatures: false,
    },
    transports: networks.reduce((acc, chain) => {
        acc[chain.id] = createTransport(chain);
        return acc;
    }, {} as Record<number, Transport>),
});

createWeb3Modal({
    wagmiConfig,
    projectId,
    enableAnalytics: true,
    enableSwaps: false,
    enableOnramp: false,
});

const httpLink = createHttpLink({
    uri: getGraphqlServerUrl(),
});

const authLink = setContext((_, { headers }) => {
    const token = new Cookies().get('verified_data')?.token;
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : '',
        },
    };
});

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
    const { network, chainId } = useSelector(
        (state: RootState) => ({
            network: selectNetworkName(state),
            chainId: state.blockchain.chainId,
        }),
        (prev, next) =>
            prev.network === next.network && prev.chainId === next.chainId
    );

    const client = useMemo(() => {
        const subgraphUrl = getSubgraphUrl(chainId);
        return new ApolloClient({
            link: ApolloLink.split(
                operation => operation.getContext().type === 'point-dashboard',
                authLink.concat(httpLink),
                subgraphUrl
                    ? createHttpLink({ uri: subgraphUrl })
                    : new GraphApolloClient({ network }).link
            ),
            cache: new InMemoryCache(),
        });
    }, [network, chainId]);

    return (
        <CookiesProvider>
            <NextUIProvider>
                <WagmiProvider config={wagmiConfig}>
                    <QueryClientProvider client={queryClient}>
                        <ApolloProvider client={client}>
                            <SecuredFinanceProvider>
                                {children}
                            </SecuredFinanceProvider>
                        </ApolloProvider>
                        <ReactQueryDevtools initialIsOpen={false} />
                    </QueryClientProvider>
                </WagmiProvider>
            </NextUIProvider>
        </CookiesProvider>
    );
};

export default App;
