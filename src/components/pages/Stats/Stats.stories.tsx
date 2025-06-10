import { RESPONSIVE_PARAMETERS, VIEWPORTS } from '.storybook/constants';
import queries from '@secured-finance/sf-graph-client/dist/graphclients';
import type { Meta, StoryFn } from '@storybook/react';
import {
    withAppLayout,
    withBalance,
    withWalletProvider,
} from 'src/../.storybook/decorators';
import { usdcBytes32, wfilBytes32 } from 'src/stories/mocks/fixtures';
import { Stats } from './Stats';

const totalUserAndVolumes = [
    {
        request: {
            query: queries.UserCountAndVolumeDocument,
            variables: {
                awaitRefetchQueries: true,
            },
        },
        result: {
            data: {
                protocol: {
                    totalUsers: '900000',
                    volumesByCurrency: [
                        {
                            currency: usdcBytes32,
                            totalVolume: '30000000',
                        },
                        {
                            currency: wfilBytes32,
                            totalVolume: '657000000000000000000000',
                        },
                    ],
                },
            },
        },
        newData: () => {
            return {
                data: {
                    protocol: {
                        totalUsers: '12145',
                        volumesByCurrency: [
                            {
                                currency: usdcBytes32,
                                totalVolume: '30000000',
                            },
                            {
                                currency: wfilBytes32,
                                totalVolume: '657000000000000000000000',
                            },
                        ],
                    },
                },
            };
        },
    },
];

export default {
    title: 'Pages/Stats',
    component: Stats,
    chromatic: { pauseAnimationAtEnd: true, viewports: [1024, 1440] },
    args: {},
    parameters: {
        apolloClient: {
            mocks: [...totalUserAndVolumes],
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
    decorators: [withAppLayout, withWalletProvider, withBalance],
} as Meta<typeof Stats>;

const Template: StoryFn<typeof Stats> = () => {
    return <Stats />;
};

export const Default = Template.bind({});

export const ConnectedToWallet = Template.bind({});
ConnectedToWallet.parameters = {
    connected: true,
};
