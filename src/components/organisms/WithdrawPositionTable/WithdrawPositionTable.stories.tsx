import { Meta, StoryFn } from '@storybook/react';
import {
    ethBytes32,
    jun23Fixture,
    mar23Fixture,
    wbtcBytes32,
    wfilBytes32,
} from 'src/stories/mocks/fixtures';
import { WithdrawPositionTable } from './WithdrawPositionTable';

export default {
    title: 'Organism/WithdrawPositionTable',
    component: WithdrawPositionTable,
    args: {
        data: [
            {
                amount: BigInt('400000000000000000000'),
                futureValue: BigInt('0'),
                currency: wfilBytes32,
                maturity: 0,
                type: 'lending-order',
            },
            {
                amount: BigInt('400000000000000000000'),
                futureValue: BigInt('500000000000000000000'),
                currency: wfilBytes32,
                maturity: jun23Fixture.toString(),
                type: 'position',
            },
            {
                amount: BigInt('-500000000000000000000'),
                currency: ethBytes32,
                futureValue: BigInt('-1000000000000000000000'),
                maturity: mar23Fixture.toString(),
                type: 'position',
            },
            {
                amount: BigInt('50000000'),
                currency: wbtcBytes32,
                futureValue: BigInt('0'),
                maturity: 0,
                type: 'collateral',
            },
        ],
        account: '0x0000000000',
        netValue: 1000,
    },
} as Meta<typeof WithdrawPositionTable>;

const Template: StoryFn<typeof WithdrawPositionTable> = args => (
    <WithdrawPositionTable {...args} />
);

export const Default = Template.bind({});
export const Empty = Template.bind({});
Empty.args = {
    data: [],
};
