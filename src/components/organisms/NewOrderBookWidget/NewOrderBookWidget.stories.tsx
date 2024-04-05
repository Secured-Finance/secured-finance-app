import { RESPONSIVE_PARAMETERS } from '.storybook/constants';
import type { Meta, StoryFn } from '@storybook/react';
import { OrderBookEntry } from 'src/hooks/useOrderbook';
import { CurrencySymbol, ZERO_BI } from 'src/utils';
import { LoanValue, Maturity } from 'src/utils/entities';
import { NewOrderBookWidget } from './NewOrderBookWidget';

const maturityMar23 = new Maturity(1675252800);
const ZERO_ENTRY = {
    amount: ZERO_BI,
    value: LoanValue.fromPrice(0, maturityMar23.toNumber()),
};

const borrowEntries: Array<OrderBookEntry> = [
    {
        amount: BigInt('43003200000000000000000'),
        value: LoanValue.fromPrice(9850, maturityMar23.toNumber()),
    },
    {
        amount: BigInt('230000052000000000000000'),
        value: LoanValue.fromPrice(9700, maturityMar23.toNumber()),
    },
    {
        amount: BigInt('15000000000000000000000'),
        value: LoanValue.fromPrice(9500, maturityMar23.toNumber()),
    },
    {
        amount: BigInt('12000000000000000000000'),
        value: LoanValue.fromPrice(9475, maturityMar23.toNumber()),
    },
    {
        amount: BigInt('1800000000000000000000'),
        value: LoanValue.fromPrice(9400, maturityMar23.toNumber()),
    },
    {
        amount: BigInt('0'),
        value: LoanValue.fromPrice(9200, maturityMar23.toNumber()),
    },
];

const lendEntries: Array<OrderBookEntry> = [
    {
        amount: BigInt('43000000000000000000000'),
        value: LoanValue.fromPrice(9200, maturityMar23.toNumber()),
    },
    {
        amount: BigInt('55000000000000000000000'),
        value: LoanValue.fromPrice(9110, maturityMar23.toNumber()),
    },
    {
        amount: BigInt('3000000000000000000000'),
        value: LoanValue.fromPrice(9050, maturityMar23.toNumber()),
    },
    {
        amount: BigInt('15000000000000000000000'),
        value: LoanValue.fromPrice(9010, maturityMar23.toNumber()),
    },
    {
        amount: BigInt('21000000000000000000000'),
        value: LoanValue.fromPrice(8980, maturityMar23.toNumber()),
    },
    {
        amount: BigInt('51000000000000000000000'),
        value: LoanValue.fromPrice(8960, maturityMar23.toNumber()),
    },
];

const generateOrderBookEntries = (n: number, start: number) => {
    return Array.from({ length: n }, (_, i) => {
        return {
            amount: BigInt(`1${i}000000`),
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
        amount: BigInt('12000000000000000000'),
        value: LoanValue.fromPrice(9653, maturityMar23.toNumber()),
    },
    {
        amount: BigInt('12301100000000000000'),
        value: LoanValue.fromPrice(9674, maturityMar23.toNumber()),
    },
    {
        amount: BigInt('10034003400000000000'),
        value: LoanValue.fromPrice(9679, maturityMar23.toNumber()),
    },
    {
        amount: BigInt('100000000000000000000'),
        value: LoanValue.fromPrice(9679, maturityMar23.toNumber()),
    },
    {
        amount: BigInt('100200000000000000000'),
        value: LoanValue.fromPrice(9679, maturityMar23.toNumber()),
    },
];

export default {
    title: 'Organism/NewOrderBookWidget',
    component: NewOrderBookWidget,
    args: {
        orderbook: {
            data: {
                borrowOrderbook: borrowEntries,
                lendOrderbook: lendEntries,
            },
            isLoading: false,
        },
        maxLendUnitPrice: 9730,
        minBorrowUnitPrice: 9808,
        marketPrice: LoanValue.fromPrice(9300, maturityMar23.toNumber()),
        currency: CurrencySymbol.WFIL,
        rowsToRenderMobile: 12,
    },
    parameters: {
        ...RESPONSIVE_PARAMETERS,
    },
} as Meta<typeof NewOrderBookWidget>;

const Template: StoryFn<typeof NewOrderBookWidget> = args => (
    <NewOrderBookWidget {...args} />
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
Bitcoin.parameters = {
    ...RESPONSIVE_PARAMETERS,
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
            lendOrderbook: [...ethEntries, ZERO_ENTRY, ZERO_ENTRY, ZERO_ENTRY],
        },
        isLoading: false,
    },
    currency: CurrencySymbol.ETH,
};
Eth.parameters = {
    ...RESPONSIVE_PARAMETERS,
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
Loading.parameters = {
    ...RESPONSIVE_PARAMETERS,
};
