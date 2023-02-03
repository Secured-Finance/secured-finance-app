import { ComponentMeta, ComponentStory } from '@storybook/react';
import { assetList } from 'src/stories/mocks/fixtures';
import { AssetSelector } from './AssetSelector';

type AllowedCcy = 'BTC' | 'ETH' | 'FIL' | 'USDC' | 'USDT';

const shortNames: Record<string, string> = {
    Bitcoin: 'BTC',
    Ethereum: 'ETH',
    Filecoin: 'FIL',
    USDC: 'USDC',
    'USD Tether': 'USDT',
};

const priceList: Record<AllowedCcy, number> = {
    BTC: 20515,
    ETH: 1012,
    FIL: 4.85,
    USDC: 1.0,
    USDT: 0.99,
};

export default {
    title: 'Molecules/AssetSelector',
    component: AssetSelector<AllowedCcy>,
    args: {
        options: assetList,
        selected: assetList[0],
        transformLabel: (v: string) => shortNames[v],
        priceList,
        onAssetChange: () => {},
        onAmountChange: () => {},
    },
} as ComponentMeta<typeof AssetSelector>;

const Template: ComponentStory<typeof AssetSelector> = args => (
    <AssetSelector {...args} />
);

export const Default = Template.bind({});
