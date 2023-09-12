import type { Meta, StoryFn } from '@storybook/react';
import { SectionWithItemsAndHeader } from './SectionWithItemsAndHeader';

export default {
    title: 'Atoms/SectionWithItemsAndHeader',
    component: SectionWithItemsAndHeader,
    args: {
        children: <div className='text-slateGray'>Header</div>,
        itemList: [
            ['Label A', 'Value A'],
            ['Label B', 'Value B'],
        ],
    },
} as Meta<typeof SectionWithItemsAndHeader>;

const Template: StoryFn<typeof SectionWithItemsAndHeader> = args => (
    <SectionWithItemsAndHeader {...args} />
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
