import { ethereum, FilIcon } from 'src/components/new/icons';
import { CurrencyInfo, currencyList } from './currencyList';

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
    currencyList[0],
    currencyList[1],
] as Array<CurrencyInfo>;
