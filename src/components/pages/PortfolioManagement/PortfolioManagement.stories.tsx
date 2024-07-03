import { RESPONSIVE_PARAMETERS } from '.storybook/constants';
import type { Meta, StoryFn } from '@storybook/react';
import { within } from '@storybook/testing-library';
import {
    withAppLayout,
    withBalance,
    withWalletProvider,
} from 'src/../.storybook/decorators';
import {
    mockFullUserOrderHistory,
    mockFullUserTransactionHistory,
} from 'src/stories/mocks/queries';
import { PortfolioManagement } from './PortfolioManagement';

export default {
    title: 'Pages/PortfolioManagement',
    component: PortfolioManagement,
    args: {},
    decorators: [withBalance, withAppLayout, withWalletProvider],
    parameters: {
        apolloClient: {
            mocks: [
                ...mockFullUserTransactionHistory,
                ...mockFullUserOrderHistory,
            ],
        },
        connected: true,
        ...RESPONSIVE_PARAMETERS,
        chromatic: {
            ...RESPONSIVE_PARAMETERS.chromatic,
            delay: 3000,
        },
        layout: 'fullscreen',
    },
} as Meta<typeof PortfolioManagement>;

const Template: StoryFn<typeof PortfolioManagement> = () => (
    <PortfolioManagement />
);

export const Default = Template.bind({});
Default.parameters = {
    connected: false,
};

export const ConnectedToWallet = Template.bind({});

export const DisplayOpenOrders = Template.bind({});
DisplayOpenOrders.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const openOrdersTab = canvas.getByTestId('Open Orders');
    openOrdersTab.click();
};

export const DisplayMyTransactions = Template.bind({});
DisplayMyTransactions.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const myTransactionsTab = canvas.getByTestId('My Transactions');
    myTransactionsTab.click();
};

export const ActivePosition = Template.bind({});
ActivePosition.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    canvas.getByTestId('Active Positions').click();
};

export const DisplayOrderHistory = Template.bind({});
DisplayOrderHistory.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const orderHistoryTab = canvas.getByTestId('Order History');
    orderHistoryTab.click();
};
