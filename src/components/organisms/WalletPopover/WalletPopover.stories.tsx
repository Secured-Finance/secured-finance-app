import type { Meta, StoryFn } from '@storybook/react';
import { within } from '@storybook/testing-library';
import {
    withChainErrorDisabled,
    withWalletProvider,
} from 'src/../.storybook/decorators';
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
    <div className='flex justify-end'>
        <WalletPopover {...args} />
    </div>
);

export const Default = Template.bind({});
export const WithChainError = Template.bind({});
WithChainError.play = ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const walletButton = canvas.getByRole('button');
    walletButton.click();
};

export const Expanded = Template.bind({});
Expanded.play = ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const walletButton = canvas.getByRole('button');
    walletButton.click();
};
Expanded.decorators = [withWalletProvider, withChainErrorDisabled];
