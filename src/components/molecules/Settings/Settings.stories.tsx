import { withWalletProvider } from '.storybook/decorators';
import type { Meta, StoryFn } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import { Settings } from './Settings';

export default {
    title: 'Molecules/Settings',
    component: Settings,
    decorators: [withWalletProvider],
    args: {
        isProduction: true,
    },
} as Meta<typeof Settings>;

const Template: StoryFn<typeof Settings> = args => (
    <div className='flex justify-end'>
        <Settings {...args} />
    </div>
);

export const Default = Template.bind({});
export const Expanded = Template.bind({});
Expanded.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const settingsButton = await canvas.findByRole('button');
    await userEvent.click(settingsButton);
};

export const IsNotProduction = Template.bind({});
IsNotProduction.args = {
    isProduction: false,
};
IsNotProduction.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const settingsButton = await canvas.findByRole('button');
    await userEvent.click(settingsButton);
};
