import { Meta, StoryFn } from '@storybook/react';
import { CurrencySymbol } from 'src/utils';
import { CollateralSnapshot } from './CollateralSnapshot';

export default {
    title: 'Molecules/CollateralSnapshot',
    component: CollateralSnapshot,
    args: {
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
} as Meta<typeof CollateralSnapshot>;

const Template: StoryFn<typeof CollateralSnapshot> = args => (
    <CollateralSnapshot {...args} />
);

export const Default = Template.bind({});
