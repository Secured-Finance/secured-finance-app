import { Side } from '@secured-finance/sf-client/dist/secured-finance-client';
import { ComponentMeta, ComponentStory } from '@storybook/react';
import { BorrowLendSelector } from '.';

export default {
    title: 'Atoms/BorrowLendSelector',
    component: BorrowLendSelector,
    args: { side: Side.BORROW, variant: 'simple' },
} as ComponentMeta<typeof BorrowLendSelector>;

const Template: ComponentStory<typeof BorrowLendSelector> = args => (
    <BorrowLendSelector {...args} />
);

export const Simple = Template.bind({});
export const Advanced = Template.bind({});
Advanced.args = {
    side: Side.LEND,
    variant: 'advanced',
};
