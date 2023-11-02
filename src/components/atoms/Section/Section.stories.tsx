import { Meta, StoryFn } from '@storybook/react';
import { Section } from './Section';

const children = (
    <p className='text-left text-white'>
        Warning: Your order price is currently lower than minimum collateral
        base price of 95. Your adjusted PV will be 20,000 WFIL. To place the
        order you need to deposit sufficient collateral. Learn More
    </p>
);
export default {
    title: 'Atoms/Section',
    component: Section,
    args: {
        children: children,
    },
} as Meta<typeof Section>;

const Template: StoryFn<typeof Section> = args => <Section {...args} />;

export const Default = Template.bind({});
export const Warning = Template.bind({});
Warning.args = {
    variant: 'warning',
};
