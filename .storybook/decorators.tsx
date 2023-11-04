import { GraphClientProvider } from '@secured-finance/sf-graph-client';
import type { StoryContext, StoryFn } from '@storybook/react';
import { Wallet } from 'ethers';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import 'src/bigIntPatch';
import { Footer } from 'src/components/atoms';
import { Header } from 'src/components/organisms';
import { Layout } from 'src/components/templates';
import { updateChainError, updateLatestBlock } from 'src/store/blockchain';
import { setMaturity } from 'src/store/landingOrderForm';
import { connectEthWallet, updateEthBalance } from 'src/store/wallet';
import AxiosMock from 'src/stories/mocks/AxiosMock';
import { CustomizedBridge } from 'src/stories/mocks/customBridge';
import { dec22Fixture } from 'src/stories/mocks/fixtures';
import { coingeckoApi } from 'src/utils/coinGeckoApi';
import timemachine from 'timemachine';
import {
    Chain,
    TransactionReceipt,
    WaitForTransactionReceiptParameters,
    createPublicClient,
    createWalletClient,
    custom,
} from 'viem';
import { privateKeyToAccount } from 'viem/accounts';
import { WagmiConfig, createConfig, sepolia } from 'wagmi';
import { MockConnector } from 'wagmi/connectors/mock';

export const withAppLayout = (Story: StoryFn) => {
    return (
        <Layout navBar={<Header showNavigation />} footer={<Footer />}>
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

const privateKey =
    '0xde926db3012af759b4f24b5a51ef6afa397f04670f634aa4f48d4480417007f3';

const signer = new CustomizedBridge(
    new Wallet(privateKey),
    new ProviderMock() as any,
    11155111
);

const account = privateKeyToAccount(privateKey);

const publicClient = createPublicClient({
    chain: sepolia,
    transport: custom(signer),
});

publicClient.waitForTransactionReceipt = async (
    args: WaitForTransactionReceiptParameters<Chain>
) => {
    return {
        blockNumber: args.hash ? BigInt('123') : BigInt('0'),
    } as unknown as TransactionReceipt;
};

const walletClient = createWalletClient({
    account: account,
    chain: sepolia,
    transport: custom(signer),
});

const connector = new MockConnector({
    chains: [sepolia],
    options: {
        chainId: sepolia.id,
        walletClient: walletClient,
        flags: { isAuthorized: true },
    },
});

export const withWalletProvider = (Story: StoryFn, Context: StoryContext) => {
    const dispatch = useDispatch();
    const config = createConfig({
        autoConnect: Context.parameters && Context.parameters.connected,
        publicClient: publicClient,
        connectors: [connector],
    });

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            dispatch(connectEthWallet(account.address));
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [dispatch]);

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

export const withEthBalance = (Story: StoryFn) => {
    const dispatch = useDispatch();
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            dispatch(updateEthBalance(2000));
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
