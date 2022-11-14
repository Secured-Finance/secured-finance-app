import { ComponentMeta, ComponentStory } from '@storybook/react';
import { SimpleAdvancedSelector } from '.';

export default {
    title: 'Atoms/SimpleAdvancedSelector',
    component: SimpleAdvancedSelector,
    args: { text: 'Simple' },
} as ComponentMeta<typeof SimpleAdvancedSelector>;

const Template: ComponentStory<typeof SimpleAdvancedSelector> = args => (
    <SimpleAdvancedSelector {...args} />
);

export const Default = Template.bind({});
