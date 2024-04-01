import { FilecoinNumber } from '@glif/filecoin-number';
import {
    Currency,
    Currency as CurrencyInterface,
    Ether,
} from '@secured-finance/sf-core';
import { BigNumber as BigNumberJS } from 'bignumber.js';
import tailwindConfig from 'src/../tailwind.config';
import BTCIcon from 'src/assets/coins/btc.svg';
import EthIcon from 'src/assets/coins/eth2.svg';
import UsdcIcon from 'src/assets/coins/usdc.svg';
import FilIcon from 'src/assets/coins/wfil.svg';
import { SvgIcon } from 'src/types';
import { hexToString } from 'viem';
import { ZERO_BI } from './collateral';
import { AUSDC } from './currencies/ausdc';
import { AXLFIL } from './currencies/axlfil';
import { BTCB } from './currencies/btcb';
import { WFIL } from './currencies/filecoin';
import { USDC } from './currencies/usdc';
import { WBTC } from './currencies/wbtc';
import { WETHE } from './currencies/wethe';

BigNumberJS.set({ EXPONENTIAL_AT: 30 }); // setting to a decent limit

const ETH = Ether.onChain();

export enum CurrencySymbol {
    ETH = 'ETH',
    WETHe = 'WETH.e',
    WFIL = 'WFIL',
    USDC = 'USDC',
    WBTC = 'WBTC',
    BTCb = 'BTC.b',
    aUSDC = 'aUSDC',
    axlFIL = 'axlFIL',
}

export const currencyMap: Readonly<
    Record<CurrencySymbol, Readonly<CurrencyInfo>>
> = {
    [CurrencySymbol.WBTC]: {
        index: 0,
        symbol: CurrencySymbol.WBTC,
        name: WBTC.onChain().name,
        icon: BTCIcon,
        coinGeckoId: 'wrapped-bitcoin',
        isCollateral: true,
        toBaseUnit: (amount: number) =>
            convertToBlockchainUnit(amount, WBTC.onChain()),
        fromBaseUnit: (amount: bigint) =>
            convertFromBlockchainUnit(amount, WBTC.onChain()),
        toCurrency: () => WBTC.onChain(),
        chartColor: tailwindConfig.theme.colors.chart.btc,
        pillColor: tailwindConfig.theme.colors.pill.btc,
        roundingDecimal: 4,
        longName: 'Bitcoin',
    },
    [CurrencySymbol.BTCb]: {
        index: 1,
        symbol: CurrencySymbol.BTCb,
        name: BTCB.onChain().name,
        icon: BTCIcon,
        coinGeckoId: 'wrapped-bitcoin',
        isCollateral: true,
        toBaseUnit: (amount: number) =>
            convertToBlockchainUnit(amount, BTCB.onChain()),
        fromBaseUnit: (amount: bigint) =>
            convertFromBlockchainUnit(amount, BTCB.onChain()),
        toCurrency: () => BTCB.onChain(),
        chartColor: tailwindConfig.theme.colors.chart.btc,
        pillColor: tailwindConfig.theme.colors.pill.btc,
        roundingDecimal: 4,
        longName: 'Bitcoin',
    },
    [CurrencySymbol.ETH]: {
        index: 2,
        icon: EthIcon,
        symbol: CurrencySymbol.ETH,
        // TODO: update sf-core to use the right name
        name: 'Ether',
        coinGeckoId: 'ethereum',
        isCollateral: true,
        toBaseUnit: (amount: number) => convertToBlockchainUnit(amount, ETH),
        fromBaseUnit: (amount: bigint) =>
            convertFromBlockchainUnit(amount, ETH),
        toCurrency: () => ETH,
        chartColor: tailwindConfig.theme.colors.chart.eth,
        pillColor: tailwindConfig.theme.colors.pill.eth,
        roundingDecimal: 3,
        longName: 'Ethereum',
    },
    [CurrencySymbol.WETHe]: {
        index: 3,
        icon: EthIcon,
        symbol: CurrencySymbol.WETHe,
        name: WETHE.onChain().name,
        coinGeckoId: 'weth',
        isCollateral: true,
        toBaseUnit: (amount: number) =>
            convertToBlockchainUnit(amount, WETHE.onChain()),
        fromBaseUnit: (amount: bigint) =>
            convertFromBlockchainUnit(amount, WETHE.onChain()),
        toCurrency: () => WETHE.onChain(),
        chartColor: tailwindConfig.theme.colors.chart.eth,
        pillColor: tailwindConfig.theme.colors.pill.eth,
        roundingDecimal: 3,
        longName: 'Wrapped Ether',
    },
    [CurrencySymbol.WFIL]: {
        index: 4,
        icon: FilIcon,
        symbol: CurrencySymbol.WFIL,
        name: WFIL.onChain().name,
        coinGeckoId: 'filecoin',
        isCollateral: false,
        toBaseUnit: (amount: number) => {
            const filAmount = new FilecoinNumber(amount, 'fil');
            return BigInt(filAmount.toAttoFil());
        },
        fromBaseUnit: (amount: bigint) =>
            convertFromBlockchainUnit(amount, WFIL.onChain()),
        toCurrency: () => WFIL.onChain(),
        chartColor: tailwindConfig.theme.colors.chart.fil,
        pillColor: tailwindConfig.theme.colors.pill.fil,
        roundingDecimal: 0,
        longName: 'Wrapped Filecoin',
    },
    [CurrencySymbol.axlFIL]: {
        index: 5,
        symbol: CurrencySymbol.axlFIL,
        name: 'Axelar Wrapped FIL',
        icon: FilIcon,
        coinGeckoId: 'filecoin',
        isCollateral: false,
        toBaseUnit: (amount: number) =>
            convertToBlockchainUnit(amount, AXLFIL.onChain()),
        fromBaseUnit: (amount: bigint) =>
            convertFromBlockchainUnit(amount, AXLFIL.onChain()),
        toCurrency: () => AXLFIL.onChain(),
        chartColor: tailwindConfig.theme.colors.chart.fil,
        pillColor: tailwindConfig.theme.colors.pill.fil,
        roundingDecimal: 0,
        longName: 'Axelar Wrapped FIL',
    },
    [CurrencySymbol.USDC]: {
        index: 6,
        symbol: CurrencySymbol.USDC,
        name: USDC.onChain().name,
        icon: UsdcIcon,
        coinGeckoId: 'usd-coin',
        isCollateral: true,
        toBaseUnit: (amount: number) =>
            convertToBlockchainUnit(amount, USDC.onChain()),
        fromBaseUnit: (amount: bigint) =>
            convertFromBlockchainUnit(amount, USDC.onChain()),
        toCurrency: () => USDC.onChain(),
        chartColor: tailwindConfig.theme.colors.chart.usdc,
        pillColor: tailwindConfig.theme.colors.pill.usdc,
        roundingDecimal: 0,
        longName: 'USD Coin',
    },
    [CurrencySymbol.aUSDC]: {
        index: 7,
        symbol: CurrencySymbol.aUSDC,
        name: 'aUSDC',
        icon: UsdcIcon,
        coinGeckoId: 'usd-coin',
        isCollateral: true,
        toBaseUnit: (amount: number) =>
            convertToBlockchainUnit(amount, AUSDC.onChain()),
        fromBaseUnit: (amount: bigint) =>
            convertFromBlockchainUnit(amount, AUSDC.onChain()),
        toCurrency: () => AUSDC.onChain(),
        chartColor: tailwindConfig.theme.colors.chart.usdc,
        pillColor: tailwindConfig.theme.colors.pill.usdc,
        roundingDecimal: 0,
        longName: 'USD Coin',
    },
};

const currencySymbolList = Object.keys(currencyMap) as CurrencySymbol[];
export const createCurrencyMap = <T,>(defaultValue: T) =>
    currencySymbolList.reduce((obj, ccy) => {
        obj[ccy] = defaultValue;
        return obj;
    }, {} as Record<CurrencySymbol, T>);

const getCurrencyMapAsList = () => {
    return Object.values(currencyMap).sort((a, b) => a.index - b.index);
};

export const amountFormatterToBase = getCurrencyMapAsList().reduce<
    Record<CurrencySymbol, (value: number) => bigint>
>(
    (acc, ccy) => ({
        ...acc,
        [ccy.symbol]: ccy.toBaseUnit,
    }),
    {} as Record<CurrencySymbol, (value: number) => bigint>
);

export const amountFormatterFromBase = getCurrencyMapAsList().reduce<
    Record<CurrencySymbol, (value: bigint) => number>
>(
    (acc, ccy) => ({
        ...acc,
        [ccy.symbol]: ccy.fromBaseUnit,
    }),
    {} as Record<CurrencySymbol, (value: bigint) => number>
);

export type CurrencyInfo = {
    index: number;
    symbol: CurrencySymbol;
    name: string;
    coinGeckoId: string;
    icon: SvgIcon;
    isCollateral: boolean;
    toBaseUnit: (amount: number) => bigint;
    fromBaseUnit: (amount: bigint) => number;
    toCurrency: () => CurrencyInterface;
    chartColor: string;
    pillColor: string;
    roundingDecimal: number;
    longName: string;
};

export const toCurrency = (ccy: CurrencySymbol) => {
    return currencyMap[ccy].toCurrency();
};

export function toCurrencySymbol(ccy: string) {
    switch (ccy) {
        case CurrencySymbol.ETH:
            return CurrencySymbol.ETH;
        case CurrencySymbol.WETHe:
            return CurrencySymbol.WETHe;
        case CurrencySymbol.WFIL:
            return CurrencySymbol.WFIL;
        case CurrencySymbol.USDC:
            return CurrencySymbol.USDC;
        case CurrencySymbol.WBTC:
            return CurrencySymbol.WBTC;
        case CurrencySymbol.BTCb:
            return CurrencySymbol.BTCb;
        case CurrencySymbol.aUSDC:
            return CurrencySymbol.aUSDC;
        case CurrencySymbol.axlFIL:
            return CurrencySymbol.axlFIL;
        default:
            return undefined;
    }
}

export function hexToCurrencySymbol(hex: string) {
    return toCurrencySymbol(hexToString(hex as `0x${string}`, { size: 32 }));
}

const convertToBlockchainUnit = (amount: number | string, ccy: Currency) => {
    const value = new BigNumberJS(amount).multipliedBy(10 ** ccy.decimals);
    if (value.isLessThan(new BigNumberJS(1))) {
        return ZERO_BI;
    }
    return BigInt(value.toString());
};

const convertFromBlockchainUnit = (amount: bigint, ccy: Currency) => {
    const value = new BigNumberJS(amount.toString()).dividedBy(
        10 ** ccy.decimals
    );
    return value.toNumber();
};

export const multiply = (
    valueA: number | bigint,
    valueB: number | bigint,
    precision = 2
) => {
    return parseFloat(
        new BigNumberJS(valueA.toString())
            .multipliedBy(valueB.toString())
            .toFixed(precision)
    );
};

export const divide = (
    valueA: number | bigint,
    valueB: number | bigint,
    precision = 2
) => {
    return parseFloat(
        new BigNumberJS(valueA.toString())
            .dividedBy(valueB.toString())
            .toFixed(precision)
    );
};
