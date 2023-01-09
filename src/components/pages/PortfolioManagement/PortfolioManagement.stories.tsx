import { ComponentMeta, ComponentStory } from '@storybook/react';
import { within } from '@storybook/testing-library';
import {
    withAppLayout,
    withAssetPrice,
    withFullPage,
    withWalletProvider,
} from 'src/../.storybook/decorators';
import {
    mockOrderHistory,
    mockTransactionHistory,
} from 'src/stories/mocks/queries';
import { PortfolioManagement } from './PortfolioManagement';

export default {
    title: 'Pages/PortfolioManagement',
    component: PortfolioManagement,
    args: {},
    decorators: [
        withFullPage,
        withAssetPrice,
        withAppLayout,
        withWalletProvider,
    ],
    parameters: {
        apolloClient: {
            mocks: [...mockTransactionHistory, ...mockOrderHistory],
        },
    },
} as ComponentMeta<typeof PortfolioManagement>;

const Template: ComponentStory<typeof PortfolioManagement> = () => (
    <PortfolioManagement />
);

export const Default = Template.bind({});

export const ConnectedToWallet = Template.bind({});
ConnectedToWallet.parameters = {
    connected: true,
};

export const DisplayOrderHistory = Template.bind({});
DisplayOrderHistory.parameters = {
    connected: true,
};
DisplayOrderHistory.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const orderHistoryTab = canvas.getByText('Open Orders');
    orderHistoryTab.click();
};
export const DisplayMyTransactions = Template.bind({});
DisplayMyTransactions.parameters = {
    connected: true,
};
DisplayMyTransactions.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const myTransactionsTab = canvas.getByText('My Transactions');
    myTransactionsTab.click();
};
