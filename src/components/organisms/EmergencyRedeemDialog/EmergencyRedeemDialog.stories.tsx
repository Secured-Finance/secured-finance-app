import { withWalletProvider } from '.storybook/decorators';
import { Meta, StoryFn } from '@storybook/react';
import { CurrencySymbol } from 'src/utils';
import { EmergencyRedeemDialog } from './EmergencyRedeemDialog';

export default {
    title: 'Organism/EmergencyRedeemDialog',
    component: EmergencyRedeemDialog,
    args: {
        open: true,
        onClose: () => {},
        netValue: '$150,100.00',
        data: [
            {
                currency: CurrencySymbol.WBTC,
                ratio: 2000, // 20%
                price: 25025,
            },
            {
                currency: CurrencySymbol.ETH,
                ratio: 3000, // 30%
                price: 1500,
            },
            {
                currency: CurrencySymbol.USDC,
                ratio: 5000, // 50%
                price: 1,
            },
        ],
        snapshotDate: 1619014400,
    },
    decorators: [withWalletProvider],
} as Meta<typeof EmergencyRedeemDialog>;

const Template: StoryFn<typeof EmergencyRedeemDialog> = args => (
    <EmergencyRedeemDialog {...args} />
);

export const Default = Template.bind({});
