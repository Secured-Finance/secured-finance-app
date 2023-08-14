import type { Meta, StoryFn } from '@storybook/react';
import { useState } from 'react';
import MetaMaskIcon from 'src/assets/img/metamask-fox.svg';
import WalletConnectIcon from 'src/assets/img/wallet-connect.svg';
import { WalletRadioGroup } from './WalletRadioGroup';

export default {
    title: 'Molecules/WalletRadioGroup',
    component: WalletRadioGroup,
} as Meta<typeof WalletRadioGroup>;

const Template: StoryFn<typeof WalletRadioGroup> = () => {
    const [value, setValue] = useState('');
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
