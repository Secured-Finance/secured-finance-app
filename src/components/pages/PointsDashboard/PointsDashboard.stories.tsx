import { RESPONSIVE_PARAMETERS, VIEWPORTS } from '.storybook/constants';
import type { Meta, StoryFn } from '@storybook/react';
import { CookiesProvider } from 'react-cookie';
import {
    withAppLayout,
    withBalance,
    withWalletProvider,
} from 'src/../.storybook/decorators';
import { PointsDashboard } from './PointsDashboard';

export default {
    title: 'Pages/PointsDashboard',
    component: PointsDashboard,
    chromatic: { pauseAnimationAtEnd: true, viewports: [1024, 1440] },
    args: {},
    parameters: {
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

export const JoinedPointProgram: StoryFn<typeof PointsDashboard> = () => {
    return (
        <CookiesProvider
            defaultSetOptions={{ path: '/' }}
            defaultCookies={{
                verified_data: {
                    token: 'mock-token-for-storybook',
                    walletAddress: '0xB98bD7C7f656290071E52D1aA617D9cB4467Fd6D',
                },
            }}
        >
            <PointsDashboard />
        </CookiesProvider>
    );
};
