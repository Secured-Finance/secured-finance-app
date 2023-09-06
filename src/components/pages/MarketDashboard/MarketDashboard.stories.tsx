import { RESPONSIVE_PARAMETERS, VIEWPORTS } from '.storybook/constants';
import queries from '@secured-finance/sf-graph-client/dist/graphclients';
import type { Meta, StoryFn } from '@storybook/react';
import { BigNumber } from 'ethers';
import {
    withAppLayout,
    withAssetPrice,
    withChainErrorDisabled,
    withEthBalance,
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
        ...RESPONSIVE_PARAMETERS,
        chromatic: {
            delay: 3000,
            viewports: [
                VIEWPORTS.MOBILE,
                VIEWPORTS.TABLET,
                VIEWPORTS.LAPTOP,
                VIEWPORTS.DESKTOP,
            ],
        },
        layout: 'fullscreen',
    },
    decorators: [
        withAppLayout,
        withWalletProvider,
        withEthBalance,
        withAssetPrice,
        withChainErrorDisabled,
    ],
} as Meta<typeof MarketDashboard>;

const Template: StoryFn<typeof MarketDashboard> = () => {
    return <MarketDashboard />;
};

export const Default = Template.bind({});

export const ConnectedToWallet = Template.bind({});
ConnectedToWallet.parameters = {
    connected: true,
};
