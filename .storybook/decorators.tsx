import { GraphClientProvider } from '@secured-finance/sf-graph-client';
import type { StoryContext, StoryFn } from '@storybook/react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import 'src/bigIntPatch';
import { Footer } from 'src/components/atoms';
import { Header } from 'src/components/organisms';
import { Layout } from 'src/components/templates';
import { updateChainError } from 'src/store/blockchain';
import { connectEthWallet, updateEthBalance } from 'src/store/wallet';
import timemachine from 'timemachine';
import {
    Chain,
    TransactionReceipt,
    WaitForTransactionReceiptParameters,
    createPublicClient,
    createWalletClient,
    http,
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

const privateKey =
    '0xde926db3012af759b4f24b5a51ef6afa397f04670f634aa4f48d4480417007f3';

const account = privateKeyToAccount(privateKey);

const publicClient = createPublicClient({
    chain: sepolia,
    transport: http(),
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
    transport: http(),
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

export const withChainErrorEnabled = (Story: StoryFn) => {
    const dispatch = useDispatch();
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            dispatch(updateChainError(true));
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [dispatch]);

    return <Story />;
};