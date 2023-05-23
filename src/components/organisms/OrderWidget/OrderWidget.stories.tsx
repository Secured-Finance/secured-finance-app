import { ComponentMeta, ComponentStory } from '@storybook/react';
import { BigNumber } from 'ethers';
import { CHROMATIC_VIEWPORTS } from 'src/../.storybook/preview';
import { OrderBookEntry } from 'src/hooks/useOrderbook';
import { CurrencySymbol } from 'src/utils';
import { LoanValue, Maturity } from 'src/utils/entities';
import { OrderWidget } from './OrderWidget';

const maturityMar23 = new Maturity(1675252800);

const borrowEntries: Array<OrderBookEntry> = [
    {
        amount: BigNumber.from('43000000000000000000000'),
        value: LoanValue.fromPrice(9653, maturityMar23.toNumber()),
    },
    {
        amount: BigNumber.from('23000000000000000000000'),
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

export default {
    title: 'Organism/OrderWidget',
    component: OrderWidget,
    args: {
        buyOrders: borrowEntries,
        sellOrders: lendEntries,
        currency: CurrencySymbol.EFIL,
    },
    parameters: {
        layout: 'fullscreen',
        chromatic: { CHROMATIC_VIEWPORTS },
    },
} as ComponentMeta<typeof OrderWidget>;

const Template: ComponentStory<typeof OrderWidget> = args => (
    <div className='w-1/2'>
        <OrderWidget {...args} />
    </div>
);

export const Default = Template.bind({});
export const HideMidPrice = Template.bind({});
HideMidPrice.args = {
    hideMidPrice: true,
};

export const Loading = Template.bind({});
Loading.args = {
    buyOrders: [],
    sellOrders: [],
};
