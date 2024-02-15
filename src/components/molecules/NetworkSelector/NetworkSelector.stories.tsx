import type { Meta, StoryFn } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import { withWalletProvider } from 'src/../.storybook/decorators';
import { NetworkSelector } from './NetworkSelector';

export default {
    title: 'Molecules/NetworkSelector',
    component: NetworkSelector,
    args: {
        networkName: 'arbitrum-sepolia',
    },
    argTypes: {
        networkName: { control: 'text' },
    },
    decorators: [withWalletProvider],
} as Meta<typeof NetworkSelector>;

const Template: StoryFn<typeof NetworkSelector> = args => (
    <NetworkSelector {...args} />
);

export const Default = Template.bind({});
Default.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const networkButton = await canvas.findByRole('button');
    await userEvent.click(networkButton);
};

export const WrongNetwork = Template.bind({});
WrongNetwork.args = {
    networkName: 'mainnet',
};
WrongNetwork.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const networkButton = await canvas.findByRole('button');
    await userEvent.click(networkButton);
};
