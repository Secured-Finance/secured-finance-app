import { ComponentMeta, ComponentStory } from '@storybook/react';
import { ExpandIndicator } from './ExpandIndicator';

export default {
    title: 'Atoms/ExpandIndicator',
    component: ExpandIndicator,
    args: {
        expanded: true,
        variant: 'solid',
    },
    argTypes: {
        variant: { control: 'select', options: ['solid', 'opaque'] },
    },
} as ComponentMeta<typeof ExpandIndicator>;

const Template: ComponentStory<typeof ExpandIndicator> = args => (
    <ExpandIndicator {...args} />
);

export const Expanded = Template.bind({});
export const Collapsed = Template.bind({});
Collapsed.args = {
    expanded: false,
};
