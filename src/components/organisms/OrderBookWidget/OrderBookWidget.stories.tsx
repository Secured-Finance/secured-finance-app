import type { Meta, StoryFn } from '@storybook/react';
import { BigNumber } from 'ethers';
import { OrderBookEntry } from 'src/hooks/useOrderbook';
import { CurrencySymbol } from 'src/utils';
import { LoanValue, Maturity } from 'src/utils/entities';
import { OrderBookWidget } from './OrderBookWidget';

const maturityMar23 = new Maturity(1675252800);
const ZERO_ENTRY = {
    amount: BigNumber.from('0'),
    value: LoanValue.fromPrice(0, maturityMar23.toNumber()),
};

const borrowEntries: Array<OrderBookEntry> = [
    {
        amount: BigNumber.from('43003200000000000000000'),
        value: LoanValue.fromPrice(9850, maturityMar23.toNumber()),
    },
    {
        amount: BigNumber.from('230000052000000000000000'),
        value: LoanValue.fromPrice(9700, maturityMar23.toNumber()),
    },
    {
        amount: BigNumber.from('15000000000000000000000'),
        value: LoanValue.fromPrice(9500, maturityMar23.toNumber()),
    },
    {
        amount: BigNumber.from('12000000000000000000000'),
        value: LoanValue.fromPrice(9475, maturityMar23.toNumber()),
    },
    {
        amount: BigNumber.from('1800000000000000000000'),
        value: LoanValue.fromPrice(9400, maturityMar23.toNumber()),
    },
    {
        amount: BigNumber.from('0'),
        value: LoanValue.fromPrice(9200, maturityMar23.toNumber()),
    },
];

const lendEntries: Array<OrderBookEntry> = [
    {
        amount: BigNumber.from('43000000000000000000000'),
        value: LoanValue.fromPrice(9200, maturityMar23.toNumber()),
    },
    {
        amount: BigNumber.from('55000000000000000000000'),
        value: LoanValue.fromPrice(9110, maturityMar23.toNumber()),
    },
    {
        amount: BigNumber.from('3000000000000000000000'),
        value: LoanValue.fromPrice(9050, maturityMar23.toNumber()),
    },
    {
        amount: BigNumber.from('15000000000000000000000'),
        value: LoanValue.fromPrice(9010, maturityMar23.toNumber()),
    },
    {
        amount: BigNumber.from('21000000000000000000000'),
        value: LoanValue.fromPrice(8980, maturityMar23.toNumber()),
    },
    {
        amount: BigNumber.from('51000000000000000000000'),
        value: LoanValue.fromPrice(8960, maturityMar23.toNumber()),
    },
];

const generateOrderBookEntries = (n: number, start: number) => {
    return Array.from({ length: n }, (_, i) => {
        return {
            amount: BigNumber.from(`1${i}000000`),
            value: LoanValue.fromPrice(start + i, maturityMar23.toNumber()),
        };
    });
};
const btcEntriesBorrow: Array<OrderBookEntry> = generateOrderBookEntries(
    40,
    9800
);
const btcEntriesLend: Array<OrderBookEntry> = generateOrderBookEntries(
    40,
    9700
);

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
                borrowOrderbook: borrowEntries,
                lendOrderbook: lendEntries,
            },
            isLoading: false,
        },
        currency: CurrencySymbol.WFIL,
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
            borrowOrderbook: btcEntriesBorrow,
            lendOrderbook: btcEntriesLend,
        },
        isLoading: false,
    },
    currency: CurrencySymbol.WBTC,
};

export const Eth = Template.bind({});
Eth.args = {
    orderbook: {
        data: {
            borrowOrderbook: [
                ...ethEntries,
                ZERO_ENTRY,
                ZERO_ENTRY,
                ZERO_ENTRY,
            ],
            lendOrderbook: [...ethEntries, ZERO_ENTRY],
        },
        isLoading: false,
    },
    currency: CurrencySymbol.ETH,
};

export const Itayose = Template.bind({});
Itayose.args = {
    variant: 'itayose',
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
