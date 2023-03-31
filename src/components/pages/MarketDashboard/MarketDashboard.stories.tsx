import queries from '@secured-finance/sf-graph-client/dist/graphclients';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { BigNumber } from 'ethers';
import {
    withAppLayout,
    withAssetPrice,
    withMaturities,
    withWalletBalances,
    withWalletProvider,
} from 'src/../.storybook/decorators';
import { mockDailyVolumes } from 'src/stories/mocks/queries';
import { MarketDashboard } from './MarketDashboard';

const totalUser = [
    {
        request: {
            query: queries.UserCountDocument,
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
                        totalUsers: BigNumber.from(12145),
                    },
                },
            };
        },
    },
];

export default {
    title: 'Pages/MarketDashboard',
    component: MarketDashboard,
    chromatic: { pauseAnimationAtEnd: true, viewports: [1024, 1440] },
    args: {},
    parameters: {
        apolloClient: {
            mocks: [...totalUser, ...mockDailyVolumes],
        },
    },
    decorators: [
        withAppLayout,
        withWalletProvider,
        withWalletBalances,
        withMaturities,
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
