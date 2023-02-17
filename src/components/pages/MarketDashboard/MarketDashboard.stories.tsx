import { UserCountDocument } from '@secured-finance/sf-graph-client/dist/graphclient';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { BigNumber } from 'ethers';
import {
    withAppLayout,
    withAssetPrice,
    withWalletBalances,
    withWalletProvider,
} from 'src/../.storybook/decorators';
import { MarketDashboard } from './MarketDashboard';

export default {
    title: 'Pages/MarketDashboard',
    component: MarketDashboard,
    chromatic: { pauseAnimationAtEnd: true },
    args: {},
    parameters: {
        apolloClient: {
            mocks: [
                {
                    request: {
                        query: UserCountDocument,
                        variables: {
                            awaitRefetchQueries: true,
                        },
                    },
                    result: {
                        data: {
                            protocol: {
                                totalUsers: BigNumber.from(900000),
                            },
                        },
                    },
                    newData: () => {
                        return {
                            data: {
                                protocol: {
                                    totalUsers: BigNumber.from(900000),
                                },
                            },
                        };
                    },
                },
            ],
        },
    },
    decorators: [
        withAppLayout,
        withWalletProvider,
        withWalletBalances,
        withAssetPrice,
    ],
} as ComponentMeta<typeof MarketDashboard>;

const Template: ComponentStory<typeof MarketDashboard> = () => {
    return <MarketDashboard />;
};

export const Default = Template.bind({});

export const ConnectedToWallet = Template.bind({});
ConnectedToWallet.parameters = {
    connected: true,
};
