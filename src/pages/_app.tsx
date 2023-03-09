import { init } from '@amplitude/analytics-browser';
import { LogLevel } from '@amplitude/analytics-types';
import { GraphClientProvider } from '@secured-finance/sf-graph-client';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { Provider } from 'react-redux';
import { Header } from 'src/components/organisms';
import { Layout } from 'src/components/templates';
import SecuredFinanceProvider from 'src/contexts/SecuredFinanceProvider';
import store from 'src/store';
import {
    getAmplitudeApiKey,
    getEthereumChainId,
    getEthereumNetwork,
} from 'src/utils';
import { UseWalletProvider } from 'use-wallet';
import '../assets/css/index.css';

init(getAmplitudeApiKey(), undefined, {
    appVersion: process.env.SF_ENV,
    logLevel: LogLevel.None,
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
                    <Layout navBar={<Header />}>
                        <Component {...pageProps} />
                    </Layout>
                </Providers>
            </Provider>
        </>
    );
}

const Providers: React.FC = ({ children }) => {
    const network = getEthereumNetwork();
    const chainId = getEthereumChainId();

    return (
        <GraphClientProvider network={network}>
            <UseWalletProvider
                connectors={{
                    injected: {
                        chainId: [chainId],
                    },
                    walletconnect: {
                        rpcUrl: 'https://ropsten.eth.aragon.network/',
                    },
                }}
            >
                <SecuredFinanceProvider>{children}</SecuredFinanceProvider>
            </UseWalletProvider>
        </GraphClientProvider>
    );
};

export default App;
