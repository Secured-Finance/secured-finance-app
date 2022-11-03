import { ComponentMeta, ComponentStory } from '@storybook/react';
import { BigNumber } from 'ethers';
import { Rate } from 'src/utils';
import { OrderBookEntry, OrderWidget } from './OrderWidget';

const orderBookEntries: Array<OrderBookEntry> = [
    {
        amount: BigNumber.from(100),
        apy: new Rate(11000),
    },
    {
        amount: BigNumber.from(200),
        apy: new Rate(22000),
    },
    {
        amount: BigNumber.from(300),
        apy: new Rate(33000),
    },
];
export default {
    title: 'Organism/OrderWidget',
    component: OrderWidget,
    args: {
        data: orderBookEntries,
    },
} as ComponentMeta<typeof OrderWidget>;

const Template: ComponentStory<typeof OrderWidget> = args => (
    <OrderWidget {...args} />
);

export const Default = Template.bind({});
