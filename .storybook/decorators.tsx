import { GraphClientProvider } from '@secured-finance/sf-graph-client';
import type { StoryContext, StoryFn } from '@storybook/react';
import { Wallet } from 'ethers';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Footer } from 'src/components/atoms';
import { Header } from 'src/components/organisms';
import { Layout } from 'src/components/templates';
import { setMidPrice } from 'src/store/analytics';
import { updateLendingMarketContract } from 'src/store/availableContracts';
import { updateChainError, updateLatestBlock } from 'src/store/blockchain';
import { setMaturity } from 'src/store/landingOrderForm';
import { updateBalance } from 'src/store/wallet';
import AxiosMock from 'src/stories/mocks/AxiosMock';
import { CustomizedBridge } from 'src/stories/mocks/customBridge';
import { dec22Fixture, maturities } from 'src/stories/mocks/fixtures';
import { CurrencySymbol } from 'src/utils';
import { coingeckoApi } from 'src/utils/coinGeckoApi';
import timemachine from 'timemachine';
import { createPublicClient, createWalletClient, custom } from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { WagmiConfig, createConfig, sepolia } from 'wagmi';
import { MockConnector } from 'wagmi/connectors/mock';

export const withAppLayout = (Story: StoryFn) => {
    return (
        <Layout navBar={<Header />} footer={<Footer />}>
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
        '0xde926db3012af759b4f24b5a51ef6afa397f04670f634aa4f48d4480417007f3'
    ),
    new ProviderMock() as any,
    11155111
);

const client = createWalletClient({
    account: privateKeyToAccount(
        '0xde926db3012af759b4f24b5a51ef6afa397f04670f634aa4f48d4480417007f3'
    ),
    chain: sepolia,
    transport: custom(signer),
});

const connector = new MockConnector({
    chains: [sepolia],
    options: {
        chainId: sepolia.id,
        walletClient: client,
        flags: { isAuthorized: true },
    },
});

export const withWalletProvider = (Story: StoryFn, Context: StoryContext) => {
    const config = createConfig({
        autoConnect: Context.parameters && Context.parameters.connected,
        publicClient: createPublicClient({
            chain: sepolia,
            transport: custom(signer),
        }),
        connectors: [connector],
    });
    return (
        <WagmiConfig config={config}>
            <Story />
        </WagmiConfig>
    );
};

export const withAssetPrice = (Story: StoryFn) => {
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

export const WithGraphClient = (Story: StoryFn) => (
    <GraphClientProvider network='sepolia'>
        <Story />
    </GraphClientProvider>
);

export const withMockDate = (Story: StoryFn, context: StoryContext) => {
    if (context?.parameters?.date?.value instanceof Date) {
        timemachine.config({
            dateString: context.parameters.date.value,
            tick: true,
        });
    }

    return <Story />;
};

export const withMaturities = (Story: StoryFn) => {
    const dispatch = useDispatch();
    useEffect(() => {
        const timerId = setTimeout(() => {
            dispatch(
                updateLendingMarketContract(maturities, CurrencySymbol.WFIL)
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

export const withWalletBalances = (Story: StoryFn) => {
    const dispatch = useDispatch();
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            dispatch(updateBalance(10000, CurrencySymbol.WFIL));
            dispatch(updateBalance(2000, CurrencySymbol.ETH));
            dispatch(updateBalance(300, CurrencySymbol.WBTC));
            dispatch(updateBalance(4000, CurrencySymbol.USDC));
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [dispatch]);

    return <Story />;
};

export const withMidPrice = (Story: StoryFn) => {
    const dispatch = useDispatch();
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            dispatch(setMidPrice(9780));
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [dispatch]);

    return <Story />;
};

export const withChainErrorDisabled = (Story: StoryFn) => {
    const dispatch = useDispatch();
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            dispatch(updateChainError(false));
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [dispatch]);

    return <Story />;
};

export const withLendingOrderForm = (Story: StoryFn) => {
    const dispatch = useDispatch();
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setMaturity(dec22Fixture.toNumber());
            // Add other needed values
        }, 100);

        return () => clearTimeout(timeoutId);
    }, [dispatch]);

    return <Story />;
};
