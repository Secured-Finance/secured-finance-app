import type { Meta, StoryFn } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import { MenuPopover } from './MenuPopover';

export default {
    title: 'Organism/MenuPopover',
    component: MenuPopover,
    parameters: {
        viewport: {
            disable: true,
        },
    },
} as Meta<typeof MenuPopover>;

const Template: StoryFn<typeof MenuPopover> = () => (
    <div>
        <MenuPopover />
    </div>
);

export const Default = Template.bind({});
export const Expanded = Template.bind({});
Expanded.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const menuButton = await canvas.findByRole('button');
    await userEvent.click(menuButton);
};
