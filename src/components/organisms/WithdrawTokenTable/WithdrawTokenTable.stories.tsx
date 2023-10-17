import { withAssetPrice } from '.storybook/decorators';
import { Meta, StoryFn } from '@storybook/react';
import { BigNumber } from 'ethers';
import {
    ethBytes32,
    wbtcBytes32,
    wfilBytes32,
} from 'src/stories/mocks/fixtures';
import { WithdrawTokenTable } from './WithdrawTokenTable';

export default {
    title: 'Organism/WithdrawTokenTable',
    component: WithdrawTokenTable,
    args: {
        data: [
            {
                amount: BigNumber.from('400000000000000000000'),
                currency: wfilBytes32,
            },
            {
                amount: BigNumber.from('-500000000000000000000'),
                currency: ethBytes32,
            },
            {
                amount: BigNumber.from('50000000'),
                currency: wbtcBytes32,
            },
        ],
    },
    decorators: [withAssetPrice],
} as Meta<typeof WithdrawTokenTable>;

const Template: StoryFn<typeof WithdrawTokenTable> = args => (
    <WithdrawTokenTable {...args} />
);

export const Default = Template.bind({});
