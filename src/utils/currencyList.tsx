import ethLogo from '../assets/coins/eth.png';
import filLogo from '../assets/coins/fil.png';

export type CurrencyInfo = {
    index: number;
    icon: string;
    shortName: string;
    fullName: string;
};

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
        shortName: 'USDC',
        fullName: 'USDC',
    },
] as Array<CurrencyInfo>;

export const getCurrencyIndexFromCurrency = (currency: string) => {
    let index;
    try {
        ({ index } = currencyList.find(({ shortName }) => {
            return shortName.toLowerCase() === currency.toLowerCase();
        }));
    } catch (error) {
        index = -1;
    }

    return index;
};
