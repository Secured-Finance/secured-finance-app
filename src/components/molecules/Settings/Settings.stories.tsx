import type { Meta, StoryFn } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import { Settings, testnetsEnabledId } from './Settings';

export default {
    title: 'Molecules/Settings',
    component: Settings,
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
    localStorage.setItem(testnetsEnabledId, 'true');
    const canvas = within(canvasElement);
    const walletButton = await canvas.findByRole('button');
    await userEvent.click(walletButton);
};

export const IsNotProduction = Template.bind({});
IsNotProduction.args = {
    isProduction: false,
};
