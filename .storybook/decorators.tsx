// Removed GraphClientProvider - using React Query + generated hooks instead
import type { StoryContext, StoryFn } from '@storybook/react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import 'src/bigIntPatch';
import { Footer } from 'src/components/atoms';
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

// No longer needed - components use generated hooks + React Query
export const WithGraphClient = (Story: StoryFn) => <Story />;

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
            dispatch(updateBalance('2000000000000000000000'));
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
