import { init } from '@amplitude/analytics-browser';
import { LogLevel } from '@amplitude/analytics-types';
import { GraphClientProvider } from '@secured-finance/sf-graph-client';
import { EthereumClient, w3mConnectors } from '@web3modal/ethereum';
import { Web3Modal } from '@web3modal/react';
import { AppProps } from 'next/app';
import Head from 'next/head';
import { Provider } from 'react-redux';
import { Footer } from 'src/components/atoms';
import { Header } from 'src/components/organisms';
import { Layout } from 'src/components/templates';
import SecuredFinanceProvider from 'src/contexts/SecuredFinanceProvider';
import store from 'src/store';
import { getAmplitudeApiKey, getEthereumNetwork } from 'src/utils';
import { createPublicClient, http } from 'viem';
import { WagmiConfig, createConfig, sepolia } from 'wagmi';
import '../assets/css/index.css';

const chains = [sepolia];
const projectId = '83209157e11b11d87ae68781c8f3762d';

init(getAmplitudeApiKey(), undefined, {
    appVersion: process.env.SF_ENV,
    logLevel: LogLevel.None,
});

const config = createConfig({
    autoConnect: true,
    publicClient: createPublicClient({
        chain: sepolia,
        transport: http(),
    }),
    connectors: [...w3mConnectors({ projectId, chains })],
});
const ethereumClient = new EthereumClient(config, chains);

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
        <GraphClientProvider network={network}>
            <WagmiConfig config={config}>
                <SecuredFinanceProvider>{children}</SecuredFinanceProvider>
                <Web3Modal
                    projectId={projectId}
                    ethereumClient={ethereumClient}
                />
            </WagmiConfig>
        </GraphClientProvider>
    );
};

export default App;
