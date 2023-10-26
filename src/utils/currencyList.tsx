import { FilecoinNumber } from '@glif/filecoin-number';
import {
    Currency,
    Currency as CurrencyInterface,
    Ether,
} from '@secured-finance/sf-core';
import { BigNumber as BigNumberJS } from 'bignumber.js';
import { BigNumber } from 'ethers';
import tailwindConfig from 'src/../tailwind.config';
import BTCIcon from 'src/assets/coins/btc.svg';
import ZcBTCIcon from 'src/assets/coins/btc_zc.svg';
import EthIcon from 'src/assets/coins/eth2.svg';
import ZcEthIcon from 'src/assets/coins/eth_zc.svg';
import FilIcon from 'src/assets/coins/fil.svg';
import ZcFilIcon from 'src/assets/coins/fil_zc.svg';
import UsdcIcon from 'src/assets/coins/usdc.svg';
import ZcUsdcIcon from 'src/assets/coins/usdc_zc.svg';
import { SvgIcon } from 'src/types';
import { hexToString } from 'viem';
import { WFIL } from './currencies/filecoin';
import { USDC } from './currencies/usdc';
import { WBTC } from './currencies/wbtc';

BigNumberJS.set({ EXPONENTIAL_AT: 30 }); // setting to a decent limit

const ETH = Ether.onChain(
    Number(process.env.NEXT_PUBLIC_ETHEREUM_CHAIN_ID ?? 1)
);

export enum CurrencySymbol {
    ETH = 'ETH',
    WFIL = 'WFIL',
    USDC = 'USDC',
    WBTC = 'WBTC',
}

export const currencyMap: Readonly<
    Record<CurrencySymbol, Readonly<CurrencyInfo>>
> = {
    [CurrencySymbol.WBTC]: {
        index: 0,
        symbol: CurrencySymbol.WBTC,
        name: WBTC.onChain().name,
        icon: BTCIcon,
        zcIcon: ZcBTCIcon,
        coinGeckoId: 'wrapped-bitcoin',
        isCollateral: true,
        toBaseUnit: (amount: number) =>
            convertToBlockchainUnit(amount, WBTC.onChain()),
        fromBaseUnit: (amount: BigNumber) =>
            convertFromBlockchainUnit(amount, WBTC.onChain()),
        toCurrency: () => WBTC.onChain(),
        chartColor: tailwindConfig.theme.colors.chart.btc,
        pillColor: tailwindConfig.theme.colors.pill.btc,
        roundingDecimal: 4,
    },
    [CurrencySymbol.ETH]: {
        index: 1,
        icon: EthIcon,
        zcIcon: ZcEthIcon,
        symbol: CurrencySymbol.ETH,
        // TODO: update sf-core to use the right name
        name: 'Ether',
        coinGeckoId: 'ethereum',
        isCollateral: true,
        toBaseUnit: (amount: number) => convertToBlockchainUnit(amount, ETH),
        fromBaseUnit: (amount: BigNumber) =>
            convertFromBlockchainUnit(amount, ETH),
        toCurrency: () => ETH,
        chartColor: tailwindConfig.theme.colors.chart.eth,
        pillColor: tailwindConfig.theme.colors.pill.eth,
        roundingDecimal: 3,
    },
    [CurrencySymbol.WFIL]: {
        index: 2,
        icon: FilIcon,
        zcIcon: ZcFilIcon,
        symbol: CurrencySymbol.WFIL,
        name: WFIL.onChain().name,
        coinGeckoId: 'filecoin',
        isCollateral: false,
        toBaseUnit: (amount: number) => {
            const filAmount = new FilecoinNumber(amount, 'fil');
            return BigNumber.from(filAmount.toAttoFil());
        },
        fromBaseUnit: (amount: BigNumber) =>
            convertFromBlockchainUnit(amount, WFIL.onChain()),
        toCurrency: () => WFIL.onChain(),
        chartColor: tailwindConfig.theme.colors.chart.fil,
        pillColor: tailwindConfig.theme.colors.pill.fil,
        roundingDecimal: 0,
    },
    [CurrencySymbol.USDC]: {
        index: 3,
        symbol: CurrencySymbol.USDC,
        name: USDC.onChain().name,
        icon: UsdcIcon,
        zcIcon: ZcUsdcIcon,
        coinGeckoId: 'usd-coin',
        isCollateral: true,
        toBaseUnit: (amount: number) =>
            convertToBlockchainUnit(amount, USDC.onChain()),
        fromBaseUnit: (amount: BigNumber) =>
            convertFromBlockchainUnit(amount, USDC.onChain()),
        toCurrency: () => USDC.onChain(),
        chartColor: tailwindConfig.theme.colors.chart.usdc,
        pillColor: tailwindConfig.theme.colors.pill.usdc,
        roundingDecimal: 0,
    },
};

export const getCurrencyMapAsList = () => {
    return Object.values(currencyMap).sort((a, b) => a.index - b.index);
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
    icon: SvgIcon;
    zcIcon: SvgIcon;
    isCollateral: boolean;
    toBaseUnit: (amount: number) => BigNumber;
    fromBaseUnit: (amount: BigNumber) => number;
    toCurrency: () => CurrencyInterface;
    chartColor: string;
    pillColor: string;
    roundingDecimal: number;
};

export const toCurrency = (ccy: CurrencySymbol) => {
    return currencyMap[ccy].toCurrency();
};

export function toCurrencySymbol(ccy: string) {
    switch (ccy) {
        case CurrencySymbol.ETH:
            return CurrencySymbol.ETH;
        case CurrencySymbol.WFIL:
            return CurrencySymbol.WFIL;
        case CurrencySymbol.USDC:
            return CurrencySymbol.USDC;
        case CurrencySymbol.WBTC:
            return CurrencySymbol.WBTC;
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

export const multiply = (valueA: number, valueB: number, precision = 2) => {
    return parseFloat(
        new BigNumberJS(valueA).multipliedBy(valueB).toFixed(precision)
    );
};

export const divide = (valueA: number, valueB: number, precision = 2) => {
    return parseFloat(
        new BigNumberJS(valueA).dividedBy(valueB).toFixed(precision)
    );
};
