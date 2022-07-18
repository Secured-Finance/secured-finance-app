import ethereum from 'src/assets/coins/eth2.svg';
import FilIcon from 'src/assets/coins/fil.svg';
import { Currency, CurrencyInfo, currencyMap } from './currencyList';

export const currencyListDropdown = [
    {
        index: 0,
        icon: ethereum,
        value: 'ETH',
        label: 'ETH',
    },
    {
        index: 1,
        icon: <FilIcon className='h-6 w-6' />,
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
    currencyMap[Currency.ETH],
    currencyMap[Currency.FIL],
] as Array<CurrencyInfo>;
