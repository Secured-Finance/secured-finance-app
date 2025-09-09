import { RESPONSIVE_PARAMETERS, VIEWPORTS } from '.storybook/constants';
import { GetUserDocument } from '@secured-finance/sf-point-client';
import type { Meta, StoryFn } from '@storybook/react';
import { FINANCIAL_CONSTANTS } from 'src/config/constants';
import {
    withAppLayout,
    withBalance,
    withWalletProvider,
} from 'src/../.storybook/decorators';
import { Campaign } from './Campaign';

const user = [
    {
        request: {
            query: GetUserDocument,
        },
        result: {
            data: {
                user: {
                    id: '1',
                    walletAddress: '0x123',
                    point: 150,
                    rank: 1,
                    joindAt: '2024-05-30T13:39:49.165Z',
                    referralCode: 'ABCDEFG123',
                    pointDetails: {
                        deposit: FINANCIAL_CONSTANTS.PERCENTAGE_DIVISOR,
                        referral: 50,
                    },
                },
            },
        },
    },
];

export default {
    title: 'Pages/Campaign',
    component: Campaign,
    chromatic: { pauseAnimationAtEnd: true, viewports: [1024, 1440] },
    args: {},
    parameters: {
        apolloClient: {
            mocks: [...user],
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
        connected: true,
    },
    decorators: [withAppLayout, withWalletProvider, withBalance],
} as Meta<typeof Campaign>;

const Template: StoryFn<typeof Campaign> = () => {
    return <Campaign />;
};

export const Default = Template.bind({});
