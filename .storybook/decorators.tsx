import { Story, StoryContext } from '@storybook/react';
import { Wallet } from 'ethers';
import { useEffect } from 'react';
import { Header } from 'src/components/organisms';
import { Layout } from 'src/components/templates';
import { CustomizedBridge } from 'src/stories/mocks/customBridge';
import { useWallet, UseWalletProvider } from 'use-wallet';

export const WithAppLayout = (Story: Story) => {
    const routes = [
        {
            path: '/',
            component: () => <Story />,
        },
    ];
    return <Layout navBar={<Header />} routes={routes} />;
};

const provider = new CustomizedBridge(
    new Wallet(
        'de926db3012af759b4f24b5a51ef6afa397f04670f634aa4f48d4480417007f3'
    )
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

export const WithWalletProvider = (Story: Story, Context: StoryContext) => {
    return (
        <UseWalletProvider
            connectors={{
                provided: { provider, chainId: [4] },
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
