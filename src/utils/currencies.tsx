import usdcLogo from '../assets/coins/usdc.png';
import ethLogo from '../assets/coins/eth.png';
import filLogo from '../assets/coins/fil.png';
import { ethereum, FilIcon } from 'src/components/new/icons';

export interface CurrencyInfo {
    index: number;
    icon: string;
    shortName: string;
    fullName: string;
}

export const currencyList = [
    {
        index: 0,
        icon: ethLogo,
        shortName: 'ETH',
        fullName: 'Ethereum',
    },
    {
        index: 1,
        icon: filLogo,
        shortName: 'FIL',
        fullName: 'Filecoin',
    },
    {
        index: 2,
        icon: usdcLogo,
        shortName: 'USDC',
        fullName: 'USDC',
    },
] as Array<CurrencyInfo>;

export const currencyListDropdown = [
    {
        index: 0,
        icon: ethereum,
        value: 'ETH',
        label: 'ETH',
    },
    {
        index: 1,
        icon: <FilIcon size={24} fill={'#fff'} />,
        value: 'FIL',
        label: 'FIL',
    },
    {
        index: 2,
        value: 'USDC',
        label: 'USDC',
    },
];

export const collateralList = [
    {
        index: 0,
        icon: ethLogo,
        shortName: 'ETH',
        fullName: 'Ethereum',
    },
    {
        index: 2,
        icon: usdcLogo,
        shortName: 'USDC',
        fullName: 'USDC',
    },
] as Array<CurrencyInfo>;
