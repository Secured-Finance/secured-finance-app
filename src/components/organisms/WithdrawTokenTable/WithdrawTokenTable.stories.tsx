import { withWalletProvider } from '.storybook/decorators';
import { Meta, StoryFn } from '@storybook/react';
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
                amount: BigInt('400000000000000000000'),
                currency: wfilBytes32,
            },
            {
                amount: BigInt('500000000000000000000'),
                currency: ethBytes32,
            },
            {
                amount: BigInt('50000000'),
                currency: wbtcBytes32,
            },
        ],
    },
    decorators: [withWalletProvider],
} as Meta<typeof WithdrawTokenTable>;

const Template: StoryFn<typeof WithdrawTokenTable> = args => (
    <WithdrawTokenTable {...args} />
);

export const Default = Template.bind({});
