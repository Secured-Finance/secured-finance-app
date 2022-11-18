import { ComponentMeta, ComponentStory } from '@storybook/react';
import { OrderSide } from 'src/hooks';
import { BorrowLendSelector } from '.';

export default {
    title: 'Atoms/BorrowLendSelector',
    component: BorrowLendSelector,
    args: { side: OrderSide.Borrow, variant: 'simple' },
} as ComponentMeta<typeof BorrowLendSelector>;

const Template: ComponentStory<typeof BorrowLendSelector> = args => (
    <BorrowLendSelector {...args} />
);

export const Simple = Template.bind({});
export const Advanced = Template.bind({});
Advanced.args = {
    side: OrderSide.Lend,
    variant: 'advanced',
};
