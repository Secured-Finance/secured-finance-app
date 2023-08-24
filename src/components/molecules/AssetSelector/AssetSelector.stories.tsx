import type { Meta, StoryFn } from '@storybook/react';
import { assetList } from 'src/stories/mocks/fixtures';
import { AssetSelector } from './AssetSelector';

type AllowedCcy = 'WBTC' | 'ETH' | 'WFIL' | 'USDC' | 'USDT';

const priceList: Record<AllowedCcy, number> = {
    WBTC: 20515,
    ETH: 1012,
    WFIL: 4.85,
    USDC: 1.0,
    USDT: 0.99,
};

export default {
    title: 'Molecules/AssetSelector',
    component: AssetSelector<AllowedCcy>,
    args: {
        options: assetList,
        selected: assetList[0],
        priceList,
        onAssetChange: () => {},
        onAmountChange: () => {},
    },
} as Meta<typeof AssetSelector>;

const Template: StoryFn<typeof AssetSelector> = args => (
    <AssetSelector {...args} />
);

export const Default = Template.bind({});
