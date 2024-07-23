import { GraphClientProvider } from '@secured-finance/sf-graph-client';
import type { StoryContext, StoryFn } from '@storybook/react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import 'src/bigIntPatch';
import { Footer } from 'src/components/atoms';
import { ToastProvider } from 'src/components/molecules/Snackbar/toast';
import { Toaster } from 'src/components/molecules/Snackbar/toaster';
import Header from 'src/components/organisms/Header/Header';
import { Layout } from 'src/components/templates';
import { updateChainError } from 'src/store/blockchain';
import { connectWallet, updateBalance } from 'src/store/wallet';
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
    const dispatch = useDispatch();
    const config = createConfig({
        autoConnect: Context.parameters && Context.parameters.connected,
        publicClient: publicClient,
        connectors: [connector],
    });

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            dispatch(connectWallet(account.address));
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

export const withBalance = (Story: StoryFn) => {
    const dispatch = useDispatch();
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            dispatch(updateBalance(2000));
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

export const withToaster = (Story: StoryFn) => {
    return (
        <ToastProvider>
            <div className='h-16'>
                <Story />
                <Toaster />
            </div>
        </ToastProvider>
    );
};
