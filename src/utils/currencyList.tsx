import { FilecoinNumber } from '@glif/filecoin-number';
import { Currency as CurrencyInterface, Ether } from '@secured-finance/sf-core';
import { BigNumber as BigNumberJS } from 'bignumber.js';
import { BigNumber } from 'ethers';
import EthIcon from 'src/assets/coins/eth2.svg';
import FilecoinIcon from 'src/assets/coins/fil.svg';
import UsdcIcon from 'src/assets/coins/usdc.svg';
import { Option } from 'src/components/atoms';
import { MAINNET_PATH_CODE } from 'src/services/ledger/constants';
import { Filecoin } from './currencies/filecoin';
import { USDC } from './currencies/usdc';
const ETH_CHAIN_ID = 60;
const ETH_TO_WEI = new BigNumberJS(10 ** 18);

const ETH = Ether.onChain(
    Number(process.env.NEXT_PUBLIC_ETHEREUM_CHAIN_ID) ?? 1
);
const FIL = Filecoin.onChain();
const UsdCoin = USDC.onChain();

export enum CurrencySymbol {
    ETH = 'ETH',
    FIL = 'FIL',
    USDC = 'USDC',
}

export const currencyMap: Readonly<
    Record<CurrencySymbol, Readonly<CurrencyInfo>>
> = {
    [CurrencySymbol.ETH]: {
        indexCcy: 0,
        icon: EthIcon,
        symbol: CurrencySymbol.ETH,
        name: ETH.name,
        chainId: ETH_CHAIN_ID,
        toBaseUnit: (amount: number) => convertEthToWei(amount),
        toCurrency: () => ETH,
    },
    [CurrencySymbol.FIL]: {
        indexCcy: 1,
        icon: FilecoinIcon,
        symbol: CurrencySymbol.FIL,
        name: FIL.name,
        chainId: MAINNET_PATH_CODE,
        toBaseUnit: (amount: number) => {
            const filAmount = new FilecoinNumber(amount, 'fil');
            return BigNumber.from(filAmount.toAttoFil());
        },
        toCurrency: () => Filecoin.onChain(),
    },
    [CurrencySymbol.USDC]: {
        indexCcy: 2,
        symbol: CurrencySymbol.USDC,
        name: UsdCoin.name,
        icon: UsdcIcon,
        chainId: ETH_CHAIN_ID,
        toBaseUnit: (amount: number) => convertEthToWei(amount),
        toCurrency: () => USDC.onChain(),
    },
};

export const getCurrencyMapAsList = () => {
    return Object.values(currencyMap);
};

export const getCurrencyMapAsOptions = () => {
    return getCurrencyMapAsList().map<Option<CurrencySymbol>>(
        ({ symbol, name, icon }) => ({
            value: symbol,
            label: name,
            iconSVG: icon,
        })
    );
};

export type CurrencyInfo = {
    indexCcy: number;
    symbol: CurrencySymbol;
    name: string;
    chainId: number;
    icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    toBaseUnit: (amount: number) => BigNumber;
    toCurrency: () => CurrencyInterface;
};

// Do not use this function, as we don't want to use the IndexCcy to identify the currency
export const getCurrencyByIndex = (value: string | number) => {
    const currency = getCurrencyMapAsList().find(
        ({ indexCcy }) =>
            indexCcy.toString().toLowerCase() === value.toString().toLowerCase()
    );

    if (!currency) {
        throw new Error(`Currency ${value} not found`);
    }

    return currency;
};

export const toCurrency = (ccy: CurrencySymbol) => {
    return currencyMap[ccy].toCurrency();
};

const convertEthToWei = (amount: number) => {
    const wei = new BigNumberJS(amount).multipliedBy(ETH_TO_WEI);
    if (wei.isLessThan(new BigNumberJS(1))) {
        return BigNumber.from(0);
    }
    return BigNumber.from(wei.toString());
};
