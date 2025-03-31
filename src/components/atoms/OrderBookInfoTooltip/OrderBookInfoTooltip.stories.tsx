import type { Meta, StoryFn } from '@storybook/react';
import { OrderBookInfoTooltip } from './OrderBookInfoTooltip';

export default {
    title: 'Atoms/OrderBookInfoTooltip',
    component: OrderBookInfoTooltip,
    args: {
        orderBookInfoData: {
            position: {
                top: 100,
                left: 300,
            },
            avgPrice: '1234.57',
            avgApr: '1000.00',
            totalAmount: 1089890.89,
            totalUsd: '56.7K',
        },
    },
} as Meta<typeof OrderBookInfoTooltip>;

const Template: StoryFn<typeof OrderBookInfoTooltip> = args => (
    <OrderBookInfoTooltip {...args} />
);

export const Default = Template.bind({});
