import type { Meta, StoryFn } from '@storybook/react';
import { screen, waitFor } from '@storybook/testing-library';
import { RESPONSIVE_PARAMETERS } from 'src/../.storybook/constants';
import {
    withAppLayout,
    withEthBalance,
    withWalletProvider,
} from 'src/../.storybook/decorators';
import {
    mockDailyVolumes,
    mockFilteredUserOrderHistory,
    mockFilteredUserTransactionHistory,
    mockTrades,
    mockUserOrderHistory,
    mockUserTransactionHistory,
} from 'src/stories/mocks/queries';
import { Landing } from './Landing';

export default {
    title: 'Pages/Landing',
    component: Landing,
    decorators: [withAppLayout, withEthBalance, withWalletProvider],
    parameters: {
        apolloClient: {
            mocks: [
                ...mockUserTransactionHistory,
                ...mockUserOrderHistory,
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

const Template: StoryFn<typeof Landing> = () => {
    return <Landing />;
};

export const Default = Template.bind({});

export const ConnectedToWallet = Template.bind({});
ConnectedToWallet.parameters = {
    connected: true,
};

export const AdvancedView = Template.bind({});
AdvancedView.play = async () => {
    screen.getByText('Advanced').click();
    await waitFor(async () => {
        screen.getByRole('button', { name: 'DEC2022' }).click();
    });

    await waitFor(() => {
        screen.getByRole('menuitem', { name: 'JUN2023' }).click();
    });
};
AdvancedView.parameters = {
    connected: true,
};
