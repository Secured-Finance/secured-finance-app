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
    // argTypes: {
    //     children: { control: 'text' },
    //     variant: { control: 'select', options: ['contained', 'outlined'] },
    //     size: { control: 'select', options: ['xs', 'sm', 'md', 'lg'] },
    // },
} as ComponentMeta<typeof WalletPopover>;

const Template: ComponentStory<typeof WalletPopover> = args => (
    <WalletPopover {...args} />
);

export const Primary = Template.bind({});
