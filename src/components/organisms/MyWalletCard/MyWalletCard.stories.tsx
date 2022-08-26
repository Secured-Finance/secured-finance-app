import { ComponentMeta, ComponentStory } from '@storybook/react';
import { WithWalletProvider } from 'src/../.storybook/decorators';
import { CurrencySymbol, WalletSource } from 'src/utils';
import { MyWalletCard } from './MyWalletCard';

export default {
    title: 'Organism/MyWalletCard',
    component: MyWalletCard,
    args: {
        assetMap: [
            {
                data: [
                    { asset: CurrencySymbol.ETH, quantity: 1.2 },
                    { asset: CurrencySymbol.USDC, quantity: 100 },
                ],
                walletSource: WalletSource.METAMASK,
                account: 'de926db3012af759b4f24b5a51ef6afa397f04670f634aa4f',
            },
            {
                data: [{ asset: CurrencySymbol.FIL, quantity: 1.2 }],
                walletSource: WalletSource.UTILWALLET,
                account: 'de926db3012af759b4f24b5',
            },
        ],
    },
    decorators: [WithWalletProvider],
    parameters: {
        chromatic: { disableSnapshot: false },
    },
} as ComponentMeta<typeof MyWalletCard>;

const Template: ComponentStory<typeof MyWalletCard> = args => (
    <div className='w-[350px]'>
        <MyWalletCard {...args} />
    </div>
);

export const Default = Template.bind({});
Default.parameters = {
    connected: true,
};
