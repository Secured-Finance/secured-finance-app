import { ComponentMeta, ComponentStory } from '@storybook/react';
import { ChartDivs } from './';

export default {
    title: 'Atoms/ChartDivs',
    component: ChartDivs,
    args: {
        header: 'Total Borrow (Asset)',
        footer: '80,000,009 FIL',
    },
    parameters: {
        chromatic: { disableSnapshot: false },
    },
} as ComponentMeta<typeof ChartDivs>;

const Template: ComponentStory<typeof ChartDivs> = args => (
    <ChartDivs {...args} />
);

export const Default = Template.bind({});

export const USD = Template.bind({});
USD.args = {
    header: 'Total Borrow (USD)',
    footer: '$650,400,073',
};
