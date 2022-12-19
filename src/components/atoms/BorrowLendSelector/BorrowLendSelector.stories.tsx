import { OrderSide } from '@secured-finance/sf-client';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { BorrowLendSelector } from '.';

export default {
    title: 'Atoms/BorrowLendSelector',
    component: BorrowLendSelector,
    args: { side: OrderSide.BORROW, variant: 'simple' },
} as ComponentMeta<typeof BorrowLendSelector>;

const Template: ComponentStory<typeof BorrowLendSelector> = args => (
    <BorrowLendSelector {...args} />
);

export const Simple = Template.bind({});
export const Advanced = Template.bind({});
Advanced.args = {
    side: OrderSide.LEND,
    variant: 'advanced',
};
