import { ComponentMeta, ComponentStory } from '@storybook/react';
import { TableHeader } from './TableHeader';

export default {
    title: 'Molecules/TableHeader',
    component: TableHeader,
    args: {
        title: 'Title',
        sortingHandler: () => {},
        isSorted: false,
    },
} as ComponentMeta<typeof TableHeader>;

const Template: ComponentStory<typeof TableHeader> = args => (
    <div className='typography-caption-2 h-14 border-b border-white-10 py-4 px-6 text-slateGray'>
        <TableHeader {...args} />
    </div>
);

export const Default = Template.bind({});
