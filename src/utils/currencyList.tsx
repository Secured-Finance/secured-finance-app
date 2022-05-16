import ethLogo from '../assets/coins/eth.png';
import filLogo from '../assets/coins/fil.png';

export type CurrencyInfo = {
    indexCcy: number;
    icon: string;
    shortName: string;
    fullName: string;
};

export const currencyList = [
    {
        indexCcy: 0,
        icon: ethLogo,
        shortName: 'ETH',
        fullName: 'Ethereum',
    },
    {
        indexCcy: 1,
        icon: filLogo,
        shortName: 'FIL',
        fullName: 'Filecoin',
    },
    {
        indexCcy: 2,
        shortName: 'USDC',
        fullName: 'USDC',
        icon: '',
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
