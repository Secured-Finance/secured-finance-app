import { ComponentMeta, ComponentStory } from '@storybook/react';
import { OrderSide } from 'src/hooks';
import { BorrowLendSelector } from '.';

export default {
    title: 'Atoms/BorrowLendSelector',
    component: BorrowLendSelector,
    args: { side: OrderSide.Borrow, variant: 'advanced' },
} as ComponentMeta<typeof BorrowLendSelector>;

const Template: ComponentStory<typeof BorrowLendSelector> = args => (
    <BorrowLendSelector {...args} />
);

export const Default = Template.bind({});
