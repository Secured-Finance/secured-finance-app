import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Input } from './Input';

export default {
    title: 'Atoms/Input',
    component: Input,
    args: {},
    parameters: {
        chromatic: { disableSnapshot: false },
    },
} as ComponentMeta<typeof Input>;

const Template: ComponentStory<typeof Input> = args => <Input />;

export const Default = Template.bind({});
