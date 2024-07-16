import type { Meta, StoryFn } from '@storybook/react';
import { RESPONSIVE_PARAMETERS } from 'src/../.storybook/constants';
import {
    withAppLayout,
    withBalance,
    withWalletProvider,
} from 'src/../.storybook/decorators';
import {
    mockDailyVolumes,
    mockFilteredUserOrderHistory,
    mockFilteredUserTransactionHistory,
    mockTrades,
} from 'src/stories/mocks/queries';
import { Landing } from './Landing';

export default {
    title: 'Pages/Landing',
    component: Landing,
    decorators: [withAppLayout, withBalance, withWalletProvider],
    args: {
        view: 'Simple',
    },
    parameters: {
        apolloClient: {
            mocks: [
                ...mockTrades,
                ...mockDailyVolumes,
                ...mockFilteredUserOrderHistory,
                ...mockFilteredUserTransactionHistory,
            ],
        },
        ...RESPONSIVE_PARAMETERS,
        layout: 'fullscreen',
    },
} as Meta<typeof Landing>;

const Template: StoryFn<typeof Landing> = args => {
    return <Landing {...args} />;
};

export const Default = Template.bind({});

export const ConnectedToWallet = Template.bind({});
ConnectedToWallet.parameters = {
    connected: true,
};

export const AdvancedViewConnected = Template.bind({});
AdvancedViewConnected.parameters = {
    connected: true,
};
AdvancedViewConnected.args = {
    view: 'Advanced',
};
