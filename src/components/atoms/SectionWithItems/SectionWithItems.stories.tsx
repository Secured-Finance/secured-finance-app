import { ComponentMeta, ComponentStory } from '@storybook/react';
import { SectionWithItems } from './SectionWithItems';

export default {
    title: 'Atoms/SectionWithItems',
    component: SectionWithItems,
    args: {
        itemList: [
            ['Label A', 'Value A'],
            ['Label B', 'Value B'],
        ],
    },
} as ComponentMeta<typeof SectionWithItems>;

const Template: ComponentStory<typeof SectionWithItems> = args => (
    <SectionWithItems {...args} />
);

export const Default = Template.bind({});
