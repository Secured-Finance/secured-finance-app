import { MAINNET_PATH_CODE } from 'src/services/ledger/constants';
import ethLogo from '../assets/coins/eth.png';
import filLogo from '../assets/coins/fil.png';

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
};

export const currencyList = [
    {
        indexCcy: 0,
        icon: ethLogo,
        shortName: Currency.ETH,
        fullName: 'Ethereum',
        chainId: ETH_CHAIN_ID,
    },
    {
        indexCcy: 1,
        icon: filLogo,
        shortName: Currency.FIL,
        fullName: 'Filecoin',
        chainId: MAINNET_PATH_CODE,
    },
    {
        indexCcy: 2,
        shortName: Currency.USDC,
        fullName: 'USDC',
        icon: '',
        chainId: ETH_CHAIN_ID,
    },
] as Array<CurrencyInfo>;

export const getCurrencyBy = (
    label: keyof CurrencyInfo,
    value: string | number
) => {
    return currencyList.find(
        ({ [label]: val }) =>
            val.toString().toLowerCase() === value.toString().toLowerCase()
    );
};
