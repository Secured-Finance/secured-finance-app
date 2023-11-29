import type { Meta, StoryFn } from '@storybook/react';
import { within } from '@storybook/testing-library';
import { RESPONSIVE_PARAMETERS } from 'src/../.storybook/constants';
import {
    withAppLayout,
    withAssetPrice,
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
    decorators: [
        withAppLayout,
        withAssetPrice,
        withEthBalance,
        withWalletProvider,
    ],
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
AdvancedView.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByText('Advanced').click();
    canvas.getByRole('button', { name: 'DEC22' }).click();
    canvas.getByRole('menuitem', { name: 'JUN23' }).click();
};
AdvancedView.parameters = {
    connected: true,
};
