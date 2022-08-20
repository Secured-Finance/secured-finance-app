import { ComponentMeta, ComponentStory } from '@storybook/react';
import { WithWalletProvider } from 'src/../.storybook/decorators';
import { CurrencySymbol } from 'src/utils';
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
                walletSource: 'metamask',
                account: 'de926db3012af759b4f24b5a51ef6afa397f04670f634aa4f',
            },
            {
                data: [{ asset: CurrencySymbol.FIL, quantity: 1.2 }],
                walletSource: 'ledger',
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
