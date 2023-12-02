import type { Meta, StoryFn } from '@storybook/react';
import { CurrencySymbol, WalletSource } from 'src/utils';
import { AssetDisclosure } from './AssetDisclosure';

export default {
    title: 'Molecules/AssetDisclosure',
    component: AssetDisclosure,
    args: {
        data: [
            { asset: CurrencySymbol.ETH, quantity: 1.2 },
            { asset: CurrencySymbol.USDC, quantity: 100 },
        ],
        walletSource: WalletSource.METAMASK,
        account: 'de926db3012af759b4f24b5a51ef6afa397f04670f634aa4f',
    },
} as Meta<typeof AssetDisclosure>;

const Template: StoryFn<typeof AssetDisclosure> = args => {
    return <AssetDisclosure {...args} />;
};

export const Default = Template.bind({});
export const Ledger = Template.bind({});
Ledger.args = {
    data: [{ asset: CurrencySymbol.WFIL, quantity: 12 }],
    walletSource: WalletSource.UTILWALLET,
    account: 'de926db3012af759b4f24b5a51ef6afa397f04670f634aa4f',
};
