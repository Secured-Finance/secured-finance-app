import { GraphClientProvider } from '@secured-finance/sf-graph-client';
import type { StoryContext, StoryFn } from '@storybook/react';
import { useEffect } from 'react';
import 'src/bigIntPatch';
import { Footer } from 'src/components/atoms';
import Header from 'src/components/organisms/Header/Header';
import { Layout } from 'src/components/templates';
import { useBlockchainStore, useWalletStore } from 'src/store';
import { account, connector, publicClient } from 'src/stories/mocks/mockWallet';
import timemachine from 'timemachine';
import { WagmiConfig, createConfig } from 'wagmi';

export const withAppLayout = (Story: StoryFn) => {
    return (
        <Layout navBar={<Header showNavigation />} footer={<Footer />}>
            <Story />
        </Layout>
    );
};

export const withWalletProvider = (Story: StoryFn, Context: StoryContext) => {
    const { connectWallet } = useWalletStore();
    const config = createConfig({
        autoConnect: Context.parameters && Context.parameters.connected,
        publicClient: publicClient,
        connectors: [connector],
    });

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            connectWallet(account.address);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [connectWallet]);

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

export const withBalance = (Story: StoryFn) => {
    const { updateBalance } = useWalletStore();
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            updateBalance('2000000000000000000000');
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [updateBalance]);

    return <Story />;
};

export const withChainErrorEnabled = (Story: StoryFn) => {
    const { updateChainError } = useBlockchainStore();
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            updateChainError(true);
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [updateChainError]);

    return <Story />;
};
