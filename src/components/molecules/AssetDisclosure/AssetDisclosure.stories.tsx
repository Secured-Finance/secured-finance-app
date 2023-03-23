import { ComponentMeta, ComponentStory } from '@storybook/react';
import { withAssetPrice } from 'src/../.storybook/decorators';
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
    decorators: [withAssetPrice],
} as ComponentMeta<typeof AssetDisclosure>;

const Template: ComponentStory<typeof AssetDisclosure> = args => {
    return <AssetDisclosure {...args} />;
};

export const Default = Template.bind({});
export const Ledger = Template.bind({});
Ledger.args = {
    data: [{ asset: CurrencySymbol.EFIL, quantity: 12 }],
    walletSource: WalletSource.UTILWALLET,
    account: 'de926db3012af759b4f24b5a51ef6afa397f04670f634aa4f',
};
