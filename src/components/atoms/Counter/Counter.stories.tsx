import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Counter } from '.';

export default {
    title: 'Atoms/Counter',
    component: Counter,
    args: {
        value: 12.234,
        prefix: '$',
        suffix: 'M',
    },
    parameters: {
        chromatic: { delay: 3000 },
    },
} as ComponentMeta<typeof Counter>;

const Template: ComponentStory<typeof Counter> = args => <Counter {...args} />;

export const Default = Template.bind({});

export const OnlyNumber = Template.bind({});
OnlyNumber.args = {
    value: 14.23,
    prefix: '',
    suffix: '',
};

export const OnlyPrefix = Template.bind({});
OnlyPrefix.args = {
    value: 4000.91,
    prefix: '$',
    suffix: '',
};

export const OnlySuffix = Template.bind({});
OnlySuffix.args = {
    value: 40.2,
    prefix: '',
    suffix: 'K',
};
