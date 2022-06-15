import { ComponentMeta, ComponentStory } from '@storybook/react';
import { Toggle } from './Toggle';

export default {
    title: 'Components/Atoms/Toggle',
    component: Toggle,
    args: {},
} as ComponentMeta<typeof Toggle>;

const Template: ComponentStory<typeof Toggle> = args => <Toggle />;

export const Default = Template.bind({});
