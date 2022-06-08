import { BigNumber, FixedNumber } from 'ethers';
import { MAINNET_PATH_CODE } from 'src/services/ledger/constants';
import ethLogo from '../assets/coins/eth.png';
import filLogo from '../assets/coins/fil.png';
import { formatFilecoin } from './formatNumbers';

const ETH_CHAIN_ID = 60;

export enum Currency {
    ETH = 'ETH',
    FIL = 'FIL',
    USDC = 'USDC',
}

export type CurrencyInfo = {
    indexCcy: number;
    icon: string;
    shortName: Currency;
    fullName: string;
    chainId: number;
    formatFunction: (amount: number) => {
        value: BigNumber | FixedNumber;
        unit: string;
    };
};

export const currencyList = [
    {
        indexCcy: 0,
        icon: ethLogo,
        shortName: Currency.ETH,
        fullName: 'Ethereum',
        chainId: ETH_CHAIN_ID,
        formatFunction: (amount: number) => {
            return {
                value: BigNumber.from(amount),
                unit: 'ETH',
            };
        },
    },
    {
        indexCcy: 1,
        icon: filLogo,
        shortName: Currency.FIL,
        fullName: 'Filecoin',
        chainId: MAINNET_PATH_CODE,
        formatFunction: (amount: number) => {
            return formatFilecoin(amount, 'attofil', 'attofil');
        },
    },
    {
        indexCcy: 2,
        shortName: Currency.USDC,
        fullName: 'USDC',
        icon: '',
        chainId: ETH_CHAIN_ID,
        formatFunction: (amount: number) => {
            return {
                value: amount.toFixed(2),
                unit: 'USDC',
            };
        },
    },
] as Readonly<CurrencyInfo[]>;

export const getCurrencyBy = (
    label: keyof CurrencyInfo,
    value: string | number
) => {
    return currencyList.find(
        ({ [label]: val }) =>
            val.toString().toLowerCase() === value.toString().toLowerCase()
    );
};

export const formatAmount = (amount: number, currency: Currency) => {
    const currencyInfo = getCurrencyBy('shortName', currency);

    if (!currencyInfo || (currencyInfo && !currencyInfo.formatFunction)) {
        return { value: BigNumber.from(amount), unit: currency };
    }

    return currencyInfo.formatFunction(amount);
};
