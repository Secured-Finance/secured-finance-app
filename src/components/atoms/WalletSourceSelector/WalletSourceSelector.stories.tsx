import type { Meta, StoryFn } from '@storybook/react';
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

const Template: StoryFn<typeof WalletSourceSelector> = args => (
    <div className='w-[360px]'>
        <WalletSourceSelector {...args} />
    </div>
);

export const Default = Template.bind({});
export const NotConnectedToWallet = Template.bind({});
NotConnectedToWallet.args = {
    account: '',
};
