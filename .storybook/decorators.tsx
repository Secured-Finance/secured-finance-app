import { GraphClientProvider } from '@secured-finance/sf-graph-client';
import type { StoryContext, StoryFn } from '@storybook/react';
import { useQueryClient } from '@tanstack/react-query';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import 'src/bigIntPatch';
import { Footer } from 'src/components/atoms';
import Header from 'src/components/organisms/Header/Header';
import { Layout } from 'src/components/templates';
import { QueryKeys } from 'src/hooks/queries';
import { updateChainError } from 'src/store/blockchain';
import { connectWallet, updateBalance } from 'src/store/wallet';
import { account } from 'src/stories/mocks/mockWallet';
import { initialRuntimeConfig } from 'src/stories/mocks/runtimeConfigMock';
import { RuntimeConfig, getRuntimeConfigUrl } from 'src/utils';
import timemachine from 'timemachine';
import { WagmiProvider, useConnect } from 'wagmi';
import { config } from './../src/stories/mocks/mockWallet';

export const withAppLayout = (Story: StoryFn) => {
    return (
        <Layout navBar={<Header showNavigation />} footer={<Footer />}>
            <Story />
        </Layout>
    );
};

const WalletConnector = ({
    children,
    isConnected,
}: {
    children: React.ReactNode;
    isConnected: boolean;
}) => {
    const dispatch = useDispatch();
    const { connectors, connect } = useConnect();

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            dispatch(connectWallet(account.address));  // always set Redux state
            if (isConnected && connectors.length > 0) {
                connect({ connector: connectors[0] });  // only call wagmi connect when requested
            }
        }, 300);
        return () => clearTimeout(timeoutId);
    }, [isConnected, connectors, connect, dispatch]);

    return <>{children}</>;
};

export const withWalletProvider = (Story: StoryFn, Context: StoryContext) => {
    const isConnected = Context.parameters?.connected ?? false;

    createWeb3Modal({
            wagmiConfig: config,
            projectId: '123',
    });

    return (
        <WagmiProvider config={config}>
            <WalletConnector isConnected={isConnected}>
                <Story />
            </WalletConnector>
        </WagmiProvider>
    );
};

const RuntimeConfigProvider = ({
    children,
    config,
}: {
    children: React.ReactNode;
    config: RuntimeConfig;
}) => {
    const queryClient = useQueryClient();
    const queryKey = [QueryKeys.RUNTIME_CONFIG, getRuntimeConfigUrl()];

    // Seeds the cache read by useRuntimeConfig; only rewritten when the story's config changes
    if (
        JSON.stringify(queryClient.getQueryData(queryKey)) !==
        JSON.stringify(config)
    ) {
        queryClient.setQueryData(queryKey, config);
    }

    return <>{children}</>;
};

// Stories get initialRuntimeConfig; override fields with the `runtimeConfig` parameter
export const withRuntimeConfig = (Story: StoryFn, Context: StoryContext) => (
    <RuntimeConfigProvider
        config={{
            ...initialRuntimeConfig,
            ...Context.parameters?.runtimeConfig,
        }}
    >
        <Story />
    </RuntimeConfigProvider>
);

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
