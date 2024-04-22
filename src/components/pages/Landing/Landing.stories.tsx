import type { Meta, StoryFn } from '@storybook/react';
import { screen, userEvent } from '@storybook/testing-library';
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
    const advancedBtn = await screen.getByText('Advanced');
    await userEvent.click(advancedBtn);

    const dec22Btn = await screen.findByRole('button', { name: 'DEC2022' });
    await userEvent.click(dec22Btn);

    const jun23Btn = await screen.getByRole('menuitem', { name: 'JUN2023' });
    await userEvent.click(jun23Btn);
};
AdvancedView.parameters = {
    connected: true,
};
