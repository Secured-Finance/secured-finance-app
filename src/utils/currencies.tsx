import { ethereum, FilIcon } from 'src/components/new/icons';
import ethLogo from '../assets/coins/eth.png';
import usdcLogo from '../assets/coins/usdc.png';
import { CurrencyInfo } from './currencyList';

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

export const collateralListDropdown = [
    {
        index: 0,
        icon: ethereum,
        value: 'ETH',
        label: 'ETH',
    },
    {
        index: 2,
        value: 'USDC',
        label: 'USDC',
    },
];

export const collateralList = [
    {
        indexCcy: 0,
        icon: ethLogo,
        shortName: 'ETH',
        fullName: 'Ethereum',
    },
    {
        indexCcy: 2,
        icon: usdcLogo,
        shortName: 'USDC',
        fullName: 'USDC',
    },
] as Array<CurrencyInfo>;
