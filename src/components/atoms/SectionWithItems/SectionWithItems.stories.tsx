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
export const WithChildren = Template.bind({});
WithChildren.args = {
    itemList: [
        [
            (<div className='text-white'>Label A</div>) as React.ReactNode,
            (<div className='text-green'>Value A</div>) as React.ReactNode,
        ],
        [
            (<div className='text-white'>Label B</div>) as React.ReactNode,
            (<div className='text-green'>Value B</div>) as React.ReactNode,
        ],
    ],
};
