import { GraphClientProvider } from '@secured-finance/sf-graph-client';
import { Story, StoryContext } from '@storybook/react';
import { Wallet } from 'ethers';
import { useEffect, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Footer } from 'src/components/atoms';
import { Header } from 'src/components/organisms';
import { Layout } from 'src/components/templates';
import { setMidPrice } from 'src/store/analytics';
import { updateLendingMarketContract } from 'src/store/availableContracts';
import { updateLatestBlock } from 'src/store/blockchain';
import { updateBalance } from 'src/store/wallet';
import AxiosMock from 'src/stories/mocks/AxiosMock';
import { CustomizedBridge } from 'src/stories/mocks/customBridge';
import { CurrencySymbol } from 'src/utils';
import { coingeckoApi } from 'src/utils/coinGeckoApi';
import timemachine from 'timemachine';
import { UseWalletProvider, useWallet } from 'use-wallet';

export const withAppLayout = (Story: Story) => {
    return (
        <Layout navBar={<Header />} footer={<Footer/>}>
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
                    'wrapped-bitcoin': {
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
    timemachine.reset();
    if (context?.parameters?.date?.value instanceof Date) {
        timemachine.config({
            dateString: context.parameters.date.value,
            tick: true,
        });
    }

    return <Story />;
};

export const withMaturities = (Story: Story) => {
    const maturities = useMemo(
        () => ({
            DEC22: {
                name: 'DEC22',
                maturity: 1669852800,
                isActive: true,
                utcOpeningDate: 1677628800,
                midUnitPrice: 9801,
                isReady: true,
            },
            MAR23: {
                name: 'MAR23',
                maturity: 1677628800,
                isActive: true,
                utcOpeningDate: 1677628800,
                midUnitPrice: 9701,
                isReady: true,
            },
            JUN23: {
                name: 'JUN23',
                maturity: 1685577600,
                isActive: true,
                utcOpeningDate: 1677628800,
                midUnitPrice: 9601,
                isReady: true,
            },
            SEP23: {
                name: 'SEP23',
                maturity: 1693526400,
                isActive: true,
                utcOpeningDate: 1677628800,
                midUnitPrice: 9501,
                isReady: true,
            },
            DEC23: {
                name: 'DEC23',
                maturity: 1701388800,
                isActive: true,
                utcOpeningDate: 1677628800,
                midUnitPrice: 9401,
                isReady: true,
            },
            MAR24: {
                name: 'MAR24',
                maturity: 1709251200,
                isActive: true,
                utcOpeningDate: 1677628800,
                midUnitPrice: 9301,
                isReady: true,
            },
            JUN24: {
                name: 'JUN24',
                maturity: 1717200000,
                isActive: true,
                utcOpeningDate: 1677628800,
                midUnitPrice: 9201,
                isReady: true,
            },
            SEP24: {
                name: 'SEP24',
                maturity: 1725148800,
                isActive: true,
                utcOpeningDate: 1677628800,
                midUnitPrice: 9101,
                isReady: true,
            },
            DEC24: {
                name: 'DEC24',
                maturity: 1733011200,
                isActive: false,
                utcOpeningDate: 1685577600,
                midUnitPrice: 9001,
                isReady: false,
            },
        }),
        []
    );
    const dispatch = useDispatch();
    useEffect(() => {
        const timerId = setTimeout(() => {
            dispatch(
                updateLendingMarketContract(maturities, CurrencySymbol.EFIL)
            );
            dispatch(
                updateLendingMarketContract(maturities, CurrencySymbol.ETH)
            );
            dispatch(
                updateLendingMarketContract(maturities, CurrencySymbol.USDC)
            );
            dispatch(
                updateLendingMarketContract(maturities, CurrencySymbol.WBTC)
            );
        }, 200);

        return () => clearTimeout(timerId);
    }, [dispatch, maturities]);

    return <Story />;
};

export const withFullPage = (Story: Story) => (
    <div className='h-[1500px] pb-10'>
        <Story />
    </div>
);

export const withWalletBalances = (Story: Story) => {
    const dispatch = useDispatch();
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            dispatch(updateBalance(10000, CurrencySymbol.EFIL));
            dispatch(updateBalance(2000, CurrencySymbol.ETH));
            dispatch(updateBalance(300, CurrencySymbol.WBTC));
            dispatch(updateBalance(4000, CurrencySymbol.USDC));
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [dispatch]);

    return <Story />;
};

export const withMidPrice = (Story: Story) => {
    const dispatch = useDispatch();
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            dispatch(setMidPrice(9780));
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [dispatch]);

    return <Story />;
};
