import { BigNumber, FixedNumber } from 'ethers';
import { SVGProps } from 'react';
import EthIcon from 'src/assets/coins/eth2.svg';
import FilecoinIcon from 'src/assets/coins/fil.svg';
import UsdcIcon from 'src/assets/coins/usdc.svg';
import { Option } from 'src/components/atoms';
import { MAINNET_PATH_CODE } from 'src/services/ledger/constants';
import { formatFilecoin } from './formatNumbers';

const ETH_CHAIN_ID = 60;

export enum Currency {
    ETH = 'ETH',
    FIL = 'FIL',
    USDC = 'USDC',
}

export const currencyMap: Readonly<Record<Currency, CurrencyInfo>> = {
    [Currency.ETH]: {
        indexCcy: 0,
        icon: 'ethLogo',
        iconSVG: EthIcon,
        shortName: Currency.ETH,
        name: 'Ethereum',
        chainId: ETH_CHAIN_ID,
        formatFunction: (amount: number) => {
            return {
                value: BigNumber.from(amount),
                unit: 'ETH',
            };
        },
    },
    [Currency.FIL]: {
        indexCcy: 1,
        icon: 'filLogo',
        iconSVG: FilecoinIcon,
        shortName: Currency.FIL,
        name: 'Filecoin',
        chainId: MAINNET_PATH_CODE,
        formatFunction: (amount: number) => {
            return formatFilecoin(amount, 'attofil', 'attofil');
        },
    },
    [Currency.USDC]: {
        indexCcy: 2,
        shortName: Currency.USDC,
        name: 'USDC',
        icon: '',
        iconSVG: UsdcIcon,
        chainId: ETH_CHAIN_ID,
        formatFunction: (amount: number) => {
            return {
                value: BigNumber.from(amount.toFixed(2)),
                unit: 'USDC',
            };
        },
    },
};

export const getCurrencyMapAsOptions = () => {
    return Object.values(currencyMap).map<Option<Currency>>(
        ({ shortName, name, iconSVG }) => ({
            value: shortName,
            label: name,
            iconSVG: iconSVG,
        })
    );
};

export type CurrencyInfo = {
    indexCcy: number;
    icon: string;
    shortName: Currency;
    name: string;
    chainId: number;
    iconSVG: (props: SVGProps<SVGSVGElement>) => JSX.Element;
    formatFunction: (amount: number) => {
        value: BigNumber | FixedNumber;
        unit: string;
    };
};

export const currencyList = [
    {
        indexCcy: 0,
        icon: 'ethLogo',
        iconSVG: EthIcon,
        shortName: Currency.ETH,
        name: 'Ethereum',
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
        icon: 'filLogo',
        iconSVG: FilecoinIcon,
        shortName: Currency.FIL,
        name: 'Filecoin',
        chainId: MAINNET_PATH_CODE,
        formatFunction: (amount: number) => {
            return formatFilecoin(amount, 'attofil', 'attofil');
        },
    },
    {
        indexCcy: 2,
        shortName: Currency.USDC,
        name: 'USDC',
        icon: '',
        iconSVG: UsdcIcon,
        chainId: ETH_CHAIN_ID,
        formatFunction: (amount: number) => {
            return {
                value: BigNumber.from(amount.toFixed(2)),
                unit: 'USDC',
            };
        },
    },
] as Readonly<CurrencyInfo[]>;

export const getCurrencyBy = (
    label: keyof CurrencyInfo,
    value: string | number
) => {
    const currency = currencyList.find(
        ({ [label]: val }) =>
            val.toString().toLowerCase() === value.toString().toLowerCase()
    );

    if (!currency) {
        throw new Error(`Currency ${value} not found`);
    }

    return currency;
};

export const formatAmount = (amount: number, currency: Currency) => {
    const currencyInfo = getCurrencyBy('shortName', currency);

    if (!currencyInfo || (currencyInfo && !currencyInfo.formatFunction)) {
        return { value: BigNumber.from(amount), unit: currency };
    }

    return currencyInfo.formatFunction(amount);
};
