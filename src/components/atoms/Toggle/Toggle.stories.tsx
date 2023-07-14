import type { Meta, StoryFn } from '@storybook/react';
import { Toggle } from './Toggle';

export default {
    title: 'Atoms/Toggle',
    component: Toggle,
    args: {},
} as Meta<typeof Toggle>;

const Template: StoryFn<typeof Toggle> = args => <Toggle {...args} />;

export const Default = Template.bind({});
