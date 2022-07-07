import { ComponentMeta, ComponentStory } from '@storybook/react';
import { WithWalletProvider } from 'src/../.storybook/decorators';
import { WalletPopover } from './WalletPopover';

export default {
    title: 'Organism/WalletPopover',
    component: WalletPopover,
    args: {
        wallet: '0x0123...321',
        networkName: 'Rinkeby',
        status: 'connected',
        //children: 'Connect Wallet',
    },
    argTypes: {
        wallet: { control: 'text' },
        networkName: { control: 'text' },
    },
    decorators: [WithWalletProvider],
} as ComponentMeta<typeof WalletPopover>;

const Template: ComponentStory<typeof WalletPopover> = args => (
    <WalletPopover {...args} />
);

export const Default = Template.bind({});
export const Primary = Template.bind({});
Primary.args = {
    wallet: '0x0123...321',
    networkName: 'Rinkeby',
    isKYC: true,
};
