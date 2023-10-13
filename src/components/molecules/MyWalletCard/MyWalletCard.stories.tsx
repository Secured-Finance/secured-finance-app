import type { Meta, StoryFn } from '@storybook/react';
import {
    withAssetPrice,
    withEthBalance,
    withWalletProvider,
} from 'src/../.storybook/decorators';
import { CurrencySymbol, WalletSource } from 'src/utils';
import { MyWalletCard } from './MyWalletCard';

export default {
    title: 'Molecules/MyWalletCard',
    component: MyWalletCard,
    args: {
        addressRecord: {
            [WalletSource.METAMASK]:
                'de926db3012af759b4f24b5a51ef6afa397f04670f634aa4f',
        },
    },
    decorators: [withEthBalance, withWalletProvider, withAssetPrice],
} as Meta<typeof MyWalletCard>;

const Template: StoryFn<typeof MyWalletCard> = args => (
    <div className='w-[350px]'>
        <MyWalletCard {...args} />
    </div>
);

export const Default = Template.bind({});
Default.parameters = {
    connected: true,
};

export const Custom = Template.bind({});
Custom.args = {
    information: {
        [WalletSource.METAMASK]: [CurrencySymbol.ETH, CurrencySymbol.USDC],
    },
};
