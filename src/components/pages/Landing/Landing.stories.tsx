import type { Meta, StoryFn } from '@storybook/react';
import { within } from '@storybook/testing-library';
import { RESPONSIVE_PARAMETERS } from 'src/../.storybook/constants';
import {
    withAppLayout,
    withAssetPrice,
    withChainErrorDisabled,
    withMaturities,
    withWalletBalances,
    withWalletProvider,
} from 'src/../.storybook/decorators';
import {
    mockDailyVolumes,
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
        withMaturities,
        withAssetPrice,
        withWalletBalances,
        withWalletProvider,
        withChainErrorDisabled,
    ],
    parameters: {
        apolloClient: {
            mocks: [
                ...mockUserTransactionHistory,
                ...mockUserOrderHistory,
                ...mockTrades,
                ...mockDailyVolumes,
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
};

export const MyOrders = Template.bind({});
MyOrders.parameters = {
    connected: true,
};

MyOrders.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByText('Advanced').click();
    canvas.getByTestId('Open Orders').click();
};
