import * as amplitude from '@amplitude/analytics-browser';
import { pageViewTrackingPlugin } from '@amplitude/plugin-page-view-tracking-browser';
import { GraphClientProvider } from '@secured-finance/sf-graph-client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { AppProps } from 'next/app';
import dynamic from 'next/dynamic';

import Head from 'next/head';
import { useRouter } from 'next/router';
import { Provider, useSelector } from 'react-redux';
import 'src/bigIntPatch';
import { Footer } from 'src/components/atoms';
import { Layout } from 'src/components/templates';
import SecuredFinanceProvider from 'src/contexts/SecuredFinanceProvider';
import { Web3Modal } from 'src/contexts/Web3Modal';
import store from 'src/store';
import { selectNetworkName } from 'src/store/blockchain';
import { RootState } from 'src/store/types';
import { getAmplitudeApiKey } from 'src/utils';

import '../assets/css/index.css';

const Header = dynamic(() => import('src/components/organisms/Header/Header'), {
    ssr: false,
});

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
        <QueryClientProvider client={queryClient}>
            <GraphClientProvider network={currentNetwork}>
                <Web3Modal>
                    <SecuredFinanceProvider>{children}</SecuredFinanceProvider>
                </Web3Modal>
            </GraphClientProvider>
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
};

export default App;
