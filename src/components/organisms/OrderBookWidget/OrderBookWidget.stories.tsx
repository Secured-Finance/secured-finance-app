import { RESPONSIVE_PARAMETERS } from '.storybook/constants';
import type { Meta, StoryFn } from '@storybook/react';
import { BigNumber } from 'ethers';
import { OrderBookEntry, sortOrders } from 'src/hooks/useOrderbook';
import { CurrencySymbol } from 'src/utils';
import { LoanValue, Maturity } from 'src/utils/entities';
import { OrderBookWidget } from './OrderBookWidget';

const maturityMar23 = new Maturity(1675252800);

const borrowEntries: Array<OrderBookEntry> = [
    {
        amount: BigNumber.from('43003200000000000000000'),
        value: LoanValue.fromPrice(9653, maturityMar23.toNumber()),
    },
    {
        amount: BigNumber.from('230000052000000000000000'),
        value: LoanValue.fromPrice(9674, maturityMar23.toNumber()),
    },
    {
        amount: BigNumber.from('15000000000000000000000'),
        value: LoanValue.fromPrice(9679, maturityMar23.toNumber()),
    },
    {
        amount: BigNumber.from('12000000000000000000000'),
        value: LoanValue.fromPrice(9685, maturityMar23.toNumber()),
    },
    {
        amount: BigNumber.from('1800000000000000000000'),
        value: LoanValue.fromPrice(9687, maturityMar23.toNumber()),
    },
    {
        amount: BigNumber.from('0'),
        value: LoanValue.fromPrice(9690, maturityMar23.toNumber()),
    },
];

const lendEntries: Array<OrderBookEntry> = [
    {
        amount: BigNumber.from('43000000000000000000000'),
        value: LoanValue.fromPrice(9690, maturityMar23.toNumber()),
    },
    {
        amount: BigNumber.from('55000000000000000000000'),
        value: LoanValue.fromPrice(9687, maturityMar23.toNumber()),
    },
    {
        amount: BigNumber.from('3000000000000000000000'),
        value: LoanValue.fromPrice(9685, maturityMar23.toNumber()),
    },
    {
        amount: BigNumber.from('15000000000000000000000'),
        value: LoanValue.fromPrice(9679, maturityMar23.toNumber()),
    },
    {
        amount: BigNumber.from('21000000000000000000000'),
        value: LoanValue.fromPrice(9674, maturityMar23.toNumber()),
    },
    {
        amount: BigNumber.from('51000000000000000000000'),
        value: LoanValue.fromPrice(9653, maturityMar23.toNumber()),
    },
];

const btcEntries: Array<OrderBookEntry> = [
    {
        amount: BigNumber.from('12000000'),
        value: LoanValue.fromPrice(9653, maturityMar23.toNumber()),
    },
    {
        amount: BigNumber.from('123000000'),
        value: LoanValue.fromPrice(9674, maturityMar23.toNumber()),
    },
    {
        amount: BigNumber.from('1000000'),
        value: LoanValue.fromPrice(9679, maturityMar23.toNumber()),
    },
    {
        amount: BigNumber.from('1000000000'),
        value: LoanValue.fromPrice(9679, maturityMar23.toNumber()),
    },
    {
        amount: BigNumber.from('100002000'),
        value: LoanValue.fromPrice(9679, maturityMar23.toNumber()),
    },
];

const ethEntries: Array<OrderBookEntry> = [
    {
        amount: BigNumber.from('12000000000000000000'),
        value: LoanValue.fromPrice(9653, maturityMar23.toNumber()),
    },
    {
        amount: BigNumber.from('12301100000000000000'),
        value: LoanValue.fromPrice(9674, maturityMar23.toNumber()),
    },
    {
        amount: BigNumber.from('10034003400000000000'),
        value: LoanValue.fromPrice(9679, maturityMar23.toNumber()),
    },
    {
        amount: BigNumber.from('100000000000000000000'),
        value: LoanValue.fromPrice(9679, maturityMar23.toNumber()),
    },
    {
        amount: BigNumber.from('100200000000000000000'),
        value: LoanValue.fromPrice(9679, maturityMar23.toNumber()),
    },
];

export default {
    title: 'Organism/OrderBookWidget',
    component: OrderBookWidget,
    args: {
        orderbook: {
            data: {
                borrowOrderbook: [...borrowEntries].sort((a, b) =>
                    sortOrders(a, b, 'asc')
                ),
                lendOrderbook: [...lendEntries].sort((a, b) =>
                    sortOrders(a, b, 'desc')
                ),
            },
            isLoading: false,
        },
        currency: CurrencySymbol.WFIL,
    },
    parameters: {
        ...RESPONSIVE_PARAMETERS,
    },
} as Meta<typeof OrderBookWidget>;

const Template: StoryFn<typeof OrderBookWidget> = args => (
    <OrderBookWidget {...args} />
);

export const Default = Template.bind({});
export const Bitcoin = Template.bind({});
Bitcoin.args = {
    orderbook: {
        data: {
            borrowOrderbook: [...btcEntries].sort((a, b) =>
                sortOrders(a, b, 'asc')
            ),
            lendOrderbook: [...btcEntries].sort((a, b) =>
                sortOrders(a, b, 'desc')
            ),
        },
        isLoading: false,
    },
    currency: CurrencySymbol.WBTC,
};

export const Eth = Template.bind({});
Eth.args = {
    orderbook: {
        data: {
            borrowOrderbook: [...ethEntries].sort((a, b) =>
                sortOrders(a, b, 'asc')
            ),
            lendOrderbook: [...ethEntries].sort((a, b) =>
                sortOrders(a, b, 'desc')
            ),
        },
        isLoading: false,
    },
    currency: CurrencySymbol.ETH,
};

export const HideMidPrice = Template.bind({});
HideMidPrice.args = {
    hideMidPrice: true,
};

export const Loading = Template.bind({});
Loading.args = {
    orderbook: {
        data: {
            borrowOrderbook: [],
            lendOrderbook: [],
        },
        isLoading: true,
    },
};
