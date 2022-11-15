import { ComponentMeta, ComponentStory } from '@storybook/react';
import { BigNumber } from 'ethers';
import { OrderBookEntry } from 'src/hooks/useOrderbook';
import { CurrencySymbol, Rate } from 'src/utils';
import { OrderWidget } from './OrderWidget';

const borrowEntries: Array<OrderBookEntry> = [
    {
        amount: BigNumber.from('43000000000000000000000'),
        apy: new Rate(195000),
        price: 80.55,
    },
    {
        amount: BigNumber.from('23000000000000000000000'),
        apy: new Rate(183000),
        price: 81.6,
    },
    {
        amount: BigNumber.from('15000000000000000000000'),
        apy: new Rate(180000),
        price: 81.28,
    },
    {
        amount: BigNumber.from('12000000000000000000000'),
        apy: new Rate(170000),
        price: 94.6,
    },
    {
        amount: BigNumber.from('1800000000000000000000'),
        apy: new Rate(160000),
        price: 82.31,
    },
    {
        amount: BigNumber.from('0'),
        apy: new Rate(0),
        price: 105,
    },
];

const lendEntries: Array<OrderBookEntry> = [
    {
        amount: BigNumber.from('43000000000000000000000'),
        apy: new Rate(200000),
        price: 79.77,
    },
    {
        amount: BigNumber.from('55000000000000000000000'),
        apy: new Rate(205000),
        price: 79.41,
    },
    {
        amount: BigNumber.from('3000000000000000000000'),
        apy: new Rate(210000),
        price: 79.05,
    },
    {
        amount: BigNumber.from('15000000000000000000000'),
        apy: new Rate(222000),
        price: 78.2,
    },
    {
        amount: BigNumber.from('21000000000000000000000'),
        apy: new Rate(235000),
        price: 77.28,
    },
    {
        amount: BigNumber.from('51000000000000000000000'),
        apy: new Rate(245000),
        price: 76.28,
    },
];

export default {
    title: 'Organism/OrderWidget',
    component: OrderWidget,
    args: {
        buyOrders: borrowEntries,
        sellOrders: lendEntries,
        currency: CurrencySymbol.FIL,
    },
} as ComponentMeta<typeof OrderWidget>;

const Template: ComponentStory<typeof OrderWidget> = args => (
    <div className='w-1/2'>
        <OrderWidget {...args} />
    </div>
);

export const Default = Template.bind({});
