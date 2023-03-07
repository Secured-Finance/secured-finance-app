import { ComponentMeta, ComponentStory } from '@storybook/react';
import { within } from '@storybook/testing-library';
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
} as ComponentMeta<typeof TableActionMenu>;

const Template: ComponentStory<typeof TableActionMenu> = args => (
    <TableActionMenu {...args} />
);

export const Default = Template.bind({});
export const Open = Template.bind({});
Open.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const actionMenu = canvas.getByRole('button');
    actionMenu.click();
};
