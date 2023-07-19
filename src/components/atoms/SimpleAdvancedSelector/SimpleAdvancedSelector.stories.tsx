import type { Meta, StoryFn } from '@storybook/react';
import { SimpleAdvancedSelector } from '.';

export default {
    title: 'Atoms/SimpleAdvancedSelector',
    component: SimpleAdvancedSelector,
    args: { text: 'Simple' },
} as Meta<typeof SimpleAdvancedSelector>;

const Template: StoryFn<typeof SimpleAdvancedSelector> = args => (
    <SimpleAdvancedSelector {...args} />
);

export const Default = Template.bind({});
