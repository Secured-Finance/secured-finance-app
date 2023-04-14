import { ComponentMeta, ComponentStory } from '@storybook/react';
import { within } from '@storybook/testing-library';
import { MenuPopover } from './MenuPopover';

export default {
    title: 'Organism/MenuPopover',
    component: MenuPopover,
} as ComponentMeta<typeof MenuPopover>;

const Template: ComponentStory<typeof MenuPopover> = () => (
    <div>
        <MenuPopover />
    </div>
);

export const Default = Template.bind({});
export const Expanded = Template.bind({});
Expanded.play = ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const menuButton = canvas.getByRole('button');
    menuButton.click();
};
