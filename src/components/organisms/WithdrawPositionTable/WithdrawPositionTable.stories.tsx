import { withAssetPrice } from '.storybook/decorators';
import { Meta, StoryFn } from '@storybook/react';
import { BigNumber } from 'ethers';
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
                amount: BigNumber.from('400000000000000000000'),
                forwardValue: BigNumber.from('500000000000000000000'),
                currency: wfilBytes32,
                maturity: jun23Fixture.toString(),
                type: 'position',
            },
            {
                amount: BigNumber.from('-500000000000000000000'),
                currency: ethBytes32,
                forwardValue: BigNumber.from('-1000000000000000000000'),
                maturity: mar23Fixture.toString(),
                type: 'position',
            },
            {
                amount: BigNumber.from('50000000'),
                currency: wbtcBytes32,
                forwardValue: BigNumber.from('0'),
                maturity: 0,
                type: 'collateral',
            },
        ],
        account: '0x0000000000',
    },
    decorators: [withAssetPrice],
} as Meta<typeof WithdrawPositionTable>;

const Template: StoryFn<typeof WithdrawPositionTable> = args => (
    <WithdrawPositionTable {...args} />
);

export const Default = Template.bind({});
export const Empty = Template.bind({});
Empty.args = {
    data: [],
};
