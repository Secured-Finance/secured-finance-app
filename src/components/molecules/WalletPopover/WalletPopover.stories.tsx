import { ComponentMeta, ComponentStory } from '@storybook/react';
import { WalletPopover } from './WalletPopover';

export default {
    title: 'Components/Molecules/WalletPopover',
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
        status: {
            control: 'select',
            options: ['connected', 'disconnected', 'connecting'],
        },
    },
} as ComponentMeta<typeof WalletPopover>;

const Template: ComponentStory<typeof WalletPopover> = args => (
    <WalletPopover {...args} />
);

export const Default = Template.bind({});
export const Primary = Template.bind({});
Primary.args = {
    wallet: '0x0123...321',
    networkName: 'Rinkeby',
    status: 'connected',
    isKYC: true,
};
