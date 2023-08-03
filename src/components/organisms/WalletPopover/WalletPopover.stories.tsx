import type { Meta, StoryFn } from '@storybook/react';
import { userEvent, within } from '@storybook/testing-library';
import { withWalletProvider } from 'src/../.storybook/decorators';
import { WalletPopover } from './WalletPopover';

export default {
    title: 'Organism/WalletPopover',
    component: WalletPopover,
    args: {
        wallet: '0x0123...321',
        networkName: 'Sepolia',
        status: 'connected',
    },
    argTypes: {
        wallet: { control: 'text' },
        networkName: { control: 'text' },
    },
    decorators: [withWalletProvider],
} as Meta<typeof WalletPopover>;

const Template: StoryFn<typeof WalletPopover> = args => (
    <div className='px-[100px]'>
        <WalletPopover {...args} />
    </div>
);

export const Default = Template.bind({});
export const Expanded = Template.bind({});
Expanded.play = async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const walletButton = await canvas.findByRole('button');
    await userEvent.click(walletButton);
};
