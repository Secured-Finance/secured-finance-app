import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Toggle } from './Toggle';

export default {
    title: 'Atoms/Toggle',
    component: Toggle,
    args: {},
} as ComponentMeta<typeof Toggle>;

const Template: ComponentStory<typeof Toggle> = args => <Toggle {...args} />;

export const Default = Template.bind({});
