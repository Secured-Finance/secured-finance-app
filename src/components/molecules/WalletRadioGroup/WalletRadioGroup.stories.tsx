import { ComponentMeta, ComponentStory } from '@storybook/react';
import React from 'react';
import MetaMaskIcon from 'src/assets/img/metamask-fox.svg';
import WalletConnectIcon from 'src/assets/img/wallet-connect.svg';
import { WalletRadioGroup } from './WalletRadioGroup';

export default {
    title: 'Molecules/WalletRadioGroup',
    component: WalletRadioGroup,
} as ComponentMeta<typeof WalletRadioGroup>;

const Template: ComponentStory<typeof WalletRadioGroup> = () => {
    const [value, setValue] = React.useState('');
    return (
        <WalletRadioGroup
            value={value}
            onChange={setValue}
            options={[
                {
                    name: 'Metamask',
                    Icon: MetaMaskIcon,
                },
                {
                    name: 'WalletConnect',
                    Icon: WalletConnectIcon,
                },
            ]}
        />
    );
};

export const Default = Template.bind({});
