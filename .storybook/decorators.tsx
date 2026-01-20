import { GraphClientProvider } from '@secured-finance/sf-graph-client';
import type { StoryContext, StoryFn } from '@storybook/react';
import { createWeb3Modal } from '@web3modal/wagmi/react';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import 'src/bigIntPatch';
import { Footer } from 'src/components/atoms';
import Header from 'src/components/organisms/Header/Header';
import { Layout } from 'src/components/templates';
import { updateChainError } from 'src/store/blockchain';
import { connectWallet, updateBalance } from 'src/store/wallet';
import timemachine from 'timemachine';
import { useConnect, WagmiProvider } from 'wagmi';
import { account, config } from './../src/stories/mocks/mockWallet';

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
        if (isConnected && connectors.length > 0) {
            const timeoutId = setTimeout(() => {
                // Connect using wagmi's connect function
                connect({ connector: connectors[0] });
                dispatch(connectWallet(account.address));
            }, 300);

            return () => clearTimeout(timeoutId);
        }
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
