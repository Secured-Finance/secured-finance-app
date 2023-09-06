import { WalletSource } from '@secured-finance/sf-client';
import type { Meta, StoryFn } from '@storybook/react';
import { useState } from 'react';
import { walletSourceList } from 'src/stories/mocks/fixtures';
import { WalletSourceSelector } from './WalletSourceSelector';

export default {
    title: 'Atoms/WalletSourceSelector',
    component: WalletSourceSelector,
    args: {
        optionList: walletSourceList,
        selected: walletSourceList[0],
        account: '0xb98bd7c7f656290071e52d1aa617d9cb4467fd6d',
        onChange: () => {},
    },
} as Meta<typeof WalletSourceSelector>;

const Template: StoryFn<typeof WalletSourceSelector> = args => {
    const [selected, setSelected] = useState(args.selected);

    const handleChange = (newValue: WalletSource) => {
        const newSource =
            walletSourceList.find(w => w.source === newValue) ||
            walletSourceList[0];
        setSelected(newSource);
        args.onChange(newValue);
    };

    return (
        <div className='w-[360px]'>
            <WalletSourceSelector
                {...args}
                selected={selected}
                onChange={handleChange}
            />
        </div>
    );
};

export const Default = Template.bind({});
export const NotConnectedToWallet = Template.bind({});
NotConnectedToWallet.args = {
    account: '',
};
