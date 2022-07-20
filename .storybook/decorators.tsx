import { Story, StoryContext } from '@storybook/react';
import { Wallet } from 'ethers';
import { useEffect } from 'react';
import { Header } from 'src/components/organisms';
import { Layout } from 'src/components/templates';
import AxiosMock from 'src/stories/mocks/AxiosMock';
import { CustomizedBridge } from 'src/stories/mocks/customBridge';
import { coingeckoApi } from 'src/utils/coinGeckoApi';
import { useWallet, UseWalletProvider } from 'use-wallet';

export const WithAppLayout = (Story: Story) => {
    const routes = [
        {
            path: '/',
            component: () => <Story />,
        },
    ];
    return <Layout navBar={<Header />} routes={routes} />;
};

const provider = new CustomizedBridge(
    new Wallet(
        'de926db3012af759b4f24b5a51ef6afa397f04670f634aa4f48d4480417007f3'
    )
);

const WithConnectedWallet = ({
    connected,
    children,
}: {
    connected: boolean;
    children: React.ReactNode;
}) => {
    const { account, connect } = useWallet();
    useEffect(() => {
        if (!account && connected) {
            connect('provided');
        }
    }, [account, connect]);

    return <>{children}</>;
};

export const WithWalletProvider = (Story: Story, Context: StoryContext) => {
    return (
        <UseWalletProvider
            connectors={{
                provided: { provider, chainId: [4] },
            }}
        >
            <WithConnectedWallet
                connected={Context.parameters && Context.parameters.connected}
            >
                <Story />
            </WithConnectedWallet>
        </UseWalletProvider>
    );
};

export const WithAssetPrice = (Story: Story) => {
    return (
        <AxiosMock
            api={coingeckoApi}
            mock={adapter =>
                adapter.onGet('/simple/price').reply(200, {
                    ethereum: {
                        usd: 2000.34,
                        usd_24h_change: 0.5162466489453748,
                    },
                    filecoin: {
                        usd: 6.0,
                        usd_24h_change: -8.208519783216566,
                    },
                    'usd-coin': {
                        usd: 1.0,
                        usd_24h_change: 0.042530768538486696,
                    },
                })
            }
        >
            <Story />
        </AxiosMock>
    );
}
