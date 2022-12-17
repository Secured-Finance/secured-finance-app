import { GraphClientProvider } from '@secured-finance/sf-graph-client';
import { Story, StoryContext } from '@storybook/react';
import { Wallet } from 'ethers';
import mockDate from 'mockdate';
import { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Header } from 'src/components/organisms';
import { Layout } from 'src/components/templates';
import { updateLendingMarketContract } from 'src/store/availableContracts';
import { updateLatestBlock } from 'src/store/blockchain';
import AxiosMock from 'src/stories/mocks/AxiosMock';
import { CustomizedBridge } from 'src/stories/mocks/customBridge';
import { CurrencySymbol } from 'src/utils';
import { coingeckoApi } from 'src/utils/coinGeckoApi';
import { useWallet, UseWalletProvider } from 'use-wallet';

export const withAppLayout = (Story: Story) => {
    return (
        <Layout navBar={<Header />}>
            <Story />
        </Layout>
    );
};

class ProviderMock {
    constructor() {}
    getBlockNumber() {
        return 123;
    }
}

const signer = new CustomizedBridge(
    new Wallet(
        'de926db3012af759b4f24b5a51ef6afa397f04670f634aa4f48d4480417007f3'
    ),
    new ProviderMock() as any
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

export const withWalletProvider = (Story: Story, Context: StoryContext) => {
    return (
        <UseWalletProvider
            connectors={{
                provided: { provider: signer, chainId: [5] },
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

export const withAssetPrice = (Story: Story) => {
    const dispatch = useDispatch();
    useEffect(() => {
        const timeoutId = setTimeout(
            () => dispatch(updateLatestBlock(12345)),
            100
        );

        return () => clearTimeout(timeoutId);
    }, [dispatch]);

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
                    bitcoin: {
                        usd: 50000.0,
                        usd_24h_change: 0.12,
                    },
                })
            }
        >
            <Story />
        </AxiosMock>
    );
};

export const WithGraphClient = (Story: Story) => (
    <GraphClientProvider network='goerli'>
        <Story />
    </GraphClientProvider>
);

export const withMockDate = (Story: Story, context: StoryContext) => {
    mockDate.reset();
    if (context?.parameters?.date?.value instanceof Date) {
        mockDate.set(context.parameters.date.value);
    }

    useEffect(() => {
        if (!context?.parameters?.date?.tick === true) {
            return;
        }
        const timerId = setInterval(() => {
            const myDate = new Date(new Date().getTime() + 50);
            mockDate.set(myDate);
        }, 50);

        return () => clearInterval(timerId);
    }, []);

    return <Story />;
};

export const withMaturities = (Story: Story) => {
    const maturities = useMemo(
        () => ({
            DEC22: 1669852800,
            MAR23: 1677628800,
            JUN23: 1685577600,
            SEP23: 1693526400,
            DEC23: 1701388800,
            MAR24: 1709251200,
            JUN24: 1717200000,
            SEP24: 1725148800,
        }),
        []
    );
    const dispatch = useDispatch();
    useEffect(() => {
        const timerId = setTimeout(() => {
            dispatch(
                updateLendingMarketContract(maturities, CurrencySymbol.FIL)
            );
            dispatch(
                updateLendingMarketContract(maturities, CurrencySymbol.ETH)
            );
            dispatch(
                updateLendingMarketContract(maturities, CurrencySymbol.USDC)
            );
        }, 200);

        return () => clearTimeout(timerId);
    }, [dispatch, maturities]);

    return <Story />;
};
