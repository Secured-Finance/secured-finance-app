import { ComponentMeta, ComponentStory } from '@storybook/react';
import BitcoinIcon from 'src/assets/coins/btc.svg';
import EthIcon from 'src/assets/coins/eth2.svg';
import FilecoinIcon from 'src/assets/coins/fil.svg';
import UsdcIcon from 'src/assets/coins/usdc.svg';
import UsdtIcon from 'src/assets/coins/usdt.svg';
import { Option } from 'src/components/atoms/DropdownSelector/DropdownSelector';
import { AssetSelector } from './AssetSelector';

type AllowedCcy = 'BTC' | 'ETH' | 'FIL' | 'USDC' | 'USDT';

const options: Array<Option<AllowedCcy>> = [
    {
        label: 'Bitcoin',
        iconSVG: BitcoinIcon,
        value: 'BTC',
    },
    {
        label: 'Ethereum',
        iconSVG: EthIcon,
        value: 'ETH',
    },
    {
        label: 'Filecoin',
        iconSVG: FilecoinIcon,
        value: 'FIL',
    },
    {
        label: 'USDC',
        iconSVG: UsdcIcon,
        value: 'USDC',
    },
    {
        label: 'USD Tether',
        iconSVG: UsdtIcon,
        value: 'USDT',
    },
];

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
        options,
        selected: options[0],
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
