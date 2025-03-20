import type { Meta, StoryFn } from '@storybook/react';
import { OrderBookInfo } from './OrderBookInfo';

export default {
    title: 'Atoms/OrderBookInfo',
    component: OrderBookInfo,
    args: {
        OrderBookInfoData: {
            position: {
                top: 100,
                left: 300,
            },
            avgPrice: 1234.567,
            avgApr: 5.6789,
            totalAmount: 100.1234,
            totalUsd: 56789.4321,
        },
    },
} as Meta<typeof OrderBookInfo>;

const Template: StoryFn<typeof OrderBookInfo> = args => (
    <OrderBookInfo {...args} />
);

export const Default = Template.bind({});
