import { FilecoinNumber } from '@glif/filecoin-number';
import {
    Currency,
    Currency as CurrencyInterface,
    Ether,
} from '@secured-finance/sf-core';
import { BigNumber as BigNumberJS } from 'bignumber.js';
import { BigNumber } from 'ethers';
import BTCIcon from 'src/assets/coins/btc.svg';
import EthIcon from 'src/assets/coins/eth2.svg';
import FilecoinIcon from 'src/assets/coins/fil.svg';
import UsdcIcon from 'src/assets/coins/usdc.svg';
import { Option } from 'src/components/atoms';
import { hexToString } from 'web3-utils';
import { Filecoin } from './currencies/filecoin';
import { USDC } from './currencies/usdc';
import { WBTC } from './currencies/wbtc';

const ETH = Ether.onChain(
    Number(process.env.NEXT_PUBLIC_ETHEREUM_CHAIN_ID ?? 1)
);

export enum CurrencySymbol {
    ETH = 'ETH',
    FIL = 'FIL',
    USDC = 'USDC',
    BTC = 'BTC',
}

export const currencyMap: Readonly<
    Record<CurrencySymbol, Readonly<CurrencyInfo>>
> = {
    [CurrencySymbol.USDC]: {
        index: 0,
        symbol: CurrencySymbol.USDC,
        name: USDC.onChain().name,
        icon: UsdcIcon,
        coinGeckoId: 'usd-coin',
        isCollateral: true,
        toBaseUnit: (amount: number) =>
            convertToBlockchainUnit(amount, USDC.onChain()),
        fromBaseUnit: (amount: BigNumber) =>
            convertFromBlockchainUnit(amount, USDC.onChain()),
        toCurrency: () => USDC.onChain(),
    },
    [CurrencySymbol.FIL]: {
        index: 1,
        icon: FilecoinIcon,
        symbol: CurrencySymbol.FIL,
        name: Filecoin.onChain().name,
        coinGeckoId: 'filecoin',
        isCollateral: false,
        toBaseUnit: (amount: number) => {
            const filAmount = new FilecoinNumber(amount, 'fil');
            return BigNumber.from(filAmount.toAttoFil());
        },
        fromBaseUnit: (amount: BigNumber) =>
            convertFromBlockchainUnit(amount, Filecoin.onChain()),
        toCurrency: () => Filecoin.onChain(),
    },
    [CurrencySymbol.ETH]: {
        index: 2,
        icon: EthIcon,
        symbol: CurrencySymbol.ETH,
        name: ETH.name,
        coinGeckoId: 'ethereum',
        isCollateral: true,
        toBaseUnit: (amount: number) => convertToBlockchainUnit(amount, ETH),
        fromBaseUnit: (amount: BigNumber) =>
            convertFromBlockchainUnit(amount, ETH),
        toCurrency: () => ETH,
    },
    [CurrencySymbol.BTC]: {
        index: 3,
        symbol: CurrencySymbol.BTC,
        name: WBTC.onChain().name,
        icon: BTCIcon,
        coinGeckoId: 'bitcoin',
        isCollateral: false,
        toBaseUnit: (amount: number) =>
            convertToBlockchainUnit(amount, WBTC.onChain()),
        fromBaseUnit: (amount: BigNumber) =>
            convertFromBlockchainUnit(amount, WBTC.onChain()),
        toCurrency: () => WBTC.onChain(),
    },
};

export const getCurrencyMapAsList = () => {
    return Object.values(currencyMap).sort((a, b) => a.index - b.index);
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

export const amountFormatterToBase = getCurrencyMapAsList().reduce<
    Record<CurrencySymbol, (value: number) => BigNumber>
>(
    (acc, ccy) => ({
        ...acc,
        [ccy.symbol]: ccy.toBaseUnit,
    }),
    {} as Record<CurrencySymbol, (value: number) => BigNumber>
);

export const amountFormatterFromBase = getCurrencyMapAsList().reduce<
    Record<CurrencySymbol, (value: BigNumber) => number>
>(
    (acc, ccy) => ({
        ...acc,
        [ccy.symbol]: ccy.fromBaseUnit,
    }),
    {} as Record<CurrencySymbol, (value: BigNumber) => number>
);

export type CurrencyInfo = {
    index: number;
    symbol: CurrencySymbol;
    name: string;
    coinGeckoId: string;
    icon: React.FunctionComponent<React.SVGProps<SVGSVGElement>>;
    isCollateral: boolean;
    toBaseUnit: (amount: number) => BigNumber;
    fromBaseUnit: (amount: BigNumber) => number;
    toCurrency: () => CurrencyInterface;
};

export const toCurrency = (ccy: CurrencySymbol) => {
    return currencyMap[ccy].toCurrency();
};

export function toCurrencySymbol(ccy: string) {
    switch (ccy) {
        case CurrencySymbol.ETH:
            return CurrencySymbol.ETH;
        case CurrencySymbol.FIL:
            return CurrencySymbol.FIL;
        case CurrencySymbol.USDC:
            return CurrencySymbol.USDC;
        case CurrencySymbol.BTC:
            return CurrencySymbol.BTC;
        default:
            return undefined;
    }
}

export function hexToCurrencySymbol(hex: string) {
    return toCurrencySymbol(hexToString(hex));
}

const convertToBlockchainUnit = (amount: number | string, ccy: Currency) => {
    const value = new BigNumberJS(amount).multipliedBy(10 ** ccy.decimals);
    if (value.isLessThan(new BigNumberJS(1))) {
        return BigNumber.from(0);
    }
    return BigNumber.from(value.toString());
};

const convertFromBlockchainUnit = (amount: BigNumber, ccy: Currency) => {
    const value = new BigNumberJS(amount.toString()).dividedBy(
        10 ** ccy.decimals
    );
    return value.toNumber();
};
