import { OrderSide } from '@secured-finance/sf-client';
import type { Meta, StoryFn } from '@storybook/react';
import { BorrowLendSelector } from '.';

export default {
    title: 'Atoms/BorrowLendSelector',
    component: BorrowLendSelector,
    args: { side: OrderSide.BORROW, variant: 'simple' },
} as Meta<typeof BorrowLendSelector>;

const Template: StoryFn<typeof BorrowLendSelector> = args => (
    <BorrowLendSelector {...args} />
);

export const Simple = Template.bind({});
export const Advanced = Template.bind({});
Advanced.args = {
    side: OrderSide.LEND,
    variant: 'advanced',
};
