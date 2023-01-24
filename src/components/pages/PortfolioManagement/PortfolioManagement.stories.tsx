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
        connected: true,
    },
} as ComponentMeta<typeof PortfolioManagement>;

const Template: ComponentStory<typeof PortfolioManagement> = () => (
    <PortfolioManagement />
);

export const Default = Template.bind({});
Default.parameters = {
    connected: false,
};

export const ConnectedToWallet = Template.bind({});
export const DisplayOrderHistory = Template.bind({});
DisplayOrderHistory.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const orderHistoryTab = canvas.getByText('Open Orders');
    orderHistoryTab.click();
};
export const DisplayMyTransactions = Template.bind({});
DisplayMyTransactions.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const myTransactionsTab = canvas.getByText('My Transactions');
    myTransactionsTab.click();
};
