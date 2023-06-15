import { RESPONSIVE_PARAMETERS } from '.storybook/constants';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { within } from '@storybook/testing-library';
import {
    withAppLayout,
    withAssetPrice,
    withChainErrorDisabled,
    withFullPage,
    withWalletBalances,
    withWalletProvider,
} from 'src/../.storybook/decorators';
import { mockUserHistory } from 'src/stories/mocks/queries';
import { PortfolioManagement } from './PortfolioManagement';

export default {
    title: 'Pages/PortfolioManagement',
    component: PortfolioManagement,
    chromatic: { viewports: [1024, 1440] },
    args: {},
    decorators: [
        withFullPage,
        withWalletBalances,
        withAssetPrice,
        withAppLayout,
        withWalletProvider,
        withChainErrorDisabled,
    ],
    parameters: {
        apolloClient: {
            mocks: mockUserHistory,
        },
        connected: true,
        ...RESPONSIVE_PARAMETERS,
        chromatic: {
            delay: 3000,
        },
        layout: 'fullscreen',
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
    const orderHistoryTab = canvas.getByTestId('Open Orders');
    orderHistoryTab.click();
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
