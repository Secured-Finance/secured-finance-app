import { ComponentMeta, ComponentStory } from '@storybook/react';
import { HorizontalListItem } from './HorizontalListItem';

export default {
    title: 'Atoms/HorizontalListItem',
    component: HorizontalListItem,
    args: {
        label: 'Label',
        value: 'Value',
    },
} as ComponentMeta<typeof HorizontalListItem>;

const Template: ComponentStory<typeof HorizontalListItem> = args => (
    <HorizontalListItem {...args} />
);

export const Default = Template.bind({});
