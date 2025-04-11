import type { Meta, StoryFn } from '@storybook/react';
import { OrderBookInfoTooltip } from './OrderBookInfoTooltip';

export default {
    title: 'Atoms/OrderBookInfoTooltip',
    component: OrderBookInfoTooltip,
    args: {
        orderBookInfoData: {
            position: {
                top: 100,
                left: 200,
            },
            avgPrice: '99.57',
            avgApr: '1000.00%',
            totalAmount: '56.17K',
            totalUsd: '56.7K',
        },
        currency: 'USDC',
    },
} as Meta<typeof OrderBookInfoTooltip>;

const Template: StoryFn<typeof OrderBookInfoTooltip> = args => (
    <OrderBookInfoTooltip {...args} />
);

export const Default = Template.bind({});
