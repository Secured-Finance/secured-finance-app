import { RESPONSIVE_PARAMETERS, VIEWPORTS } from '.storybook/constants';
import queries from '@secured-finance/sf-graph-client/dist/graphclients';
import type { Meta, StoryFn } from '@storybook/react';
import {
    withAppLayout,
    withBalance,
    withWalletProvider,
} from 'src/../.storybook/decorators';
import { mockDailyVolumes } from 'src/stories/mocks/queries';
import { Stats } from './Stats';

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
                    totalUsers: '900000',
                },
            },
        },
        newData: () => {
            return {
                data: {
                    protocol: {
                        totalUsers: '12145',
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
