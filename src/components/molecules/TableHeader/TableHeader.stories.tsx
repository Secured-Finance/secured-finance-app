import { ComponentMeta, ComponentStory } from '@storybook/react';
import { TableHeader } from './TableHeader';

export default {
    title: 'Molecules/TableHeader',
    component: TableHeader,
    args: {
        title: 'Title',
    },
} as ComponentMeta<typeof TableHeader>;

const Template: ComponentStory<typeof TableHeader> = args => (
    <div className='typography-caption-2 h-14 w-1/3 border-b border-white-10 px-6 py-4 text-slateGray'>
        <TableHeader {...args} />
    </div>
);

export const Default = Template.bind({});
export const Sorting = Template.bind({});
Sorting.args = {
    ...Default.args,
    sortingHandler: () => {},
    isSorted: true,
};

export const Aligned = Template.bind({});
Aligned.args = {
    ...Default.args,
    align: 'right',
};
