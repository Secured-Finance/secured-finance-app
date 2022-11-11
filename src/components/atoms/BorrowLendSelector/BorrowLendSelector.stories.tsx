import { ComponentMeta, ComponentStory } from '@storybook/react';
import { BorrowLendSelector } from '.';

export default {
    title: 'Atoms/BorrowLendSelector',
    component: BorrowLendSelector,
    args: { activeButton: 'Borrow' },
} as ComponentMeta<typeof BorrowLendSelector>;

const Template: ComponentStory<typeof BorrowLendSelector> = args => (
    <BorrowLendSelector {...args} />
);

export const Default = Template.bind({});
