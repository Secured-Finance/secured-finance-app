import { RESPONSIVE_PARAMETERS, VIEWPORTS } from '.storybook/constants';
import {
    GetQuestsDocument,
    GetUserDocument,
    GetUsersDocument,
    VerifyDocument,
} from '@secured-finance/sf-point-client';
import type { Meta, StoryFn } from '@storybook/react';
import { utils } from 'ethers';
import { CookiesProvider } from 'react-cookie';
import {
    withAppLayout,
    withBalance,
    withWalletProvider,
} from 'src/../.storybook/decorators';
import { PointsDashboard } from './PointsDashboard';

const quests = [
    {
        request: { query: GetQuestsDocument },
        result: {
            data: {
                quests: [
                    {
                        id: '1',
                        title: 'Daily Login Quest',
                        description: 'Description 1',
                        questType: 'DailyLogin',
                        point: 100,
                        isHighlight: false,
                        chainId: null,
                        network: null,
                        currencies: null,
                        bonusPoints: null,
                        startAt: '2024-05-01T00:00:00.000Z',
                        endAt: '2024-05-30T00:00:00.000Z',
                    },
                    {
                        id: '2',
                        title: 'Deposit Quest',
                        description: 'Description 2',
                        questType: 'Deposit',
                        point: 2,
                        isHighlight: true,
                        chainId: 11155111,
                        network: 'mainnet',
                        currencies: ['ETH', 'WBTC', 'USDC'],
                        bonusPoints: null,
                        startAt: null,
                        endAt: null,
                    },
                    {
                        id: '3',
                        title: 'Limit Order Quest',
                        description: 'Description 3',
                        questType: 'LimitOrder',
                        point: 4,
                        isHighlight: false,
                        chainId: 42161,
                        network: 'arbitrum-one',
                        currencies: ['USDC'],
                        bonusPoints: {
                            lend: 4,
                            borrow: 2,
                        },
                        startAt: '2022-02-01T00:00:00.000Z',
                        endAt: null,
                    },
                ],
            },
        },
    },
];

const users = [
    {
        request: {
            query: GetUsersDocument,
            variables: {
                page: 1,
                limit: 30,
            },
        },
        result: {
            data: {
                users: [
                    ...Array.from({ length: 30 }).map((_, index) => ({
                        id: `${index}`,
                        walletAddress: utils.hexlify(
                            BigInt((index + 1).toString().padEnd(40, '0')) +
                                BigInt(index),
                        ),
                        point: 100 - index,
                        rank: index + 1,
                    })),
                ],
            },
        },
    },
];

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
                        deposit: 100,
                        referral: 50,
                    },
                    boostPercentage: 500,
                },
            },
        },
    },
];

const signIn = [
    {
        request: {
            query: VerifyDocument,
        },
        variables: {
            input: {
                walletAddress: '0xB98bD7C7f656290071E52D1aA617D9cB4467Fd6D',
                timestamp: new Date().toISOString(),
                signature: 'dummy-signature',
            },
        },
        result: {
            data: {
                token: '1234567890',
            },
        },
    },
];

export default {
    title: 'Pages/PointsDashboard',
    component: PointsDashboard,
    chromatic: { pauseAnimationAtEnd: true, viewports: [1024, 1440] },
    args: {},
    parameters: {
        apolloClient: {
            mocks: [...signIn, ...quests, ...users],
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
        query: {
            ref: 'ABCDEF1234',
        },
    },
    decorators: [withAppLayout, withWalletProvider, withBalance],
} as Meta<typeof PointsDashboard>;

const Template: StoryFn<typeof PointsDashboard> = () => {
    return (
        <CookiesProvider>
            <PointsDashboard />
        </CookiesProvider>
    );
};

export const Default = Template.bind({});

export const NotConnected = Template.bind({});
NotConnected.parameters = {
    connected: false,
};

export const JoinedPointProgram = Template.bind({});
JoinedPointProgram.parameters = {
    apolloClient: {
        mocks: [...signIn, ...quests, ...users, ...user],
    },
    cookie: {
        verified_data: {
            token: '1234567890',
            walletAddress: '0xB98bD7C7f656290071E52D1aA617D9cB4467Fd6D',
        },
    },
};
