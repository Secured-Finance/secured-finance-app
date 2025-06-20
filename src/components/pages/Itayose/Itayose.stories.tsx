import { withAppLayout, withWalletProvider } from '.storybook/decorators';
import type { Meta, StoryFn } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import {
    mockDailyVolumes,
    mockItayoseFilteredUserOrderHistory,
    mockTransactionsQuery,
} from 'src/stories/mocks/queries';
import { Itayose } from './Itayose';

export default {
    title: 'Pages/Itayose',
    component: Itayose,
    args: {},
    parameters: {
        apolloClient: {
            mocks: [
                ...mockItayoseFilteredUserOrderHistory,
                ...mockDailyVolumes,
                ...mockTransactionsQuery,
            ],
        },
        chromatic: { delay: 5000 },
        connected: true,
    },
    decorators: [withAppLayout, withWalletProvider],
} as Meta<typeof Itayose>;

const Template: StoryFn<typeof Itayose> = () => <Itayose />;

export const Default = Template.bind({});

export const OrderHistory = Template.bind({});
OrderHistory.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const orderHistoryTab = await canvas.findByTestId('Order History');
    await userEvent.click(orderHistoryTab);
};
