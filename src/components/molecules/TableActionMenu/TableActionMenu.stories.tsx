import type { Meta, StoryFn } from '@storybook/react';
import { TableActionMenu } from './TableActionMenu';

export default {
    title: 'Molecules/TableActionMenu',
    component: TableActionMenu,
    args: {
        items: [
            { text: 'Edit', onClick: () => {} },
            { text: 'Delete', onClick: () => {} },
            { text: 'Disable', onClick: () => {}, disabled: true },
        ],
    },
} as Meta<typeof TableActionMenu>;

const Template: StoryFn<typeof TableActionMenu> = args => (
    <div className='flex w-full justify-center'>
        <TableActionMenu {...args} />
    </div>
);

export const Default = Template.bind({});
