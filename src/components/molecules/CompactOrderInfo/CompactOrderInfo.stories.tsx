import type { Meta, StoryFn } from '@storybook/react';
import CompactOrderInfo from './CompactOrderInfo';

export default {
    title: 'Components/Molecules/CompactOrderInfo',
    component: CompactOrderInfo,
} as Meta<typeof CompactOrderInfo>;

const Template: StoryFn<typeof CompactOrderInfo> = args => (
    <CompactOrderInfo {...args} />
);

export const Default = Template.bind({});
Default.args = {
    data: {
        orderId: 1,
        amount: '100000000',
        currency: '0x57494c',
        side: '1',
        maturity: '1667280000',
        unitPrice: '9500',
    },
};

export const NoData = Template.bind({});
NoData.args = {};

export const MultipleOrders = Template.bind({});
MultipleOrders.args = {
    data: [
        {
            orderId: 1,
            amount: '100000000',
            currency: '0x57494c',
            side: '1',
            maturity: '1667280000',
            unitPrice: '9500',
        },
        {
            orderId: 2,
            amount: '200000000',
            currency: '0x555344',
            side: '2',
            maturity: '1669718400',
            unitPrice: '9600',
        },
    ],
};
