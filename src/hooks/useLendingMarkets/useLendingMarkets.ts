import { fromBytes32 } from '@secured-finance/sf-graph-client';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { QueryKeys } from 'src/hooks/queries';
import useSF from 'src/hooks/useSecuredFinance';
import { CurrencySymbol, getCurrencyMapAsList } from 'src/utils';
import { isPastDate } from 'src/utils/date';

const PRE_OPEN_TIME = 60 * 60 * 24 * 2; // 2 days in seconds

export type LendingMarket = {
    name: string;
    maturity: number;
    isActive: boolean;
    utcOpeningDate: number;
    midUnitPrice: number;
    preOpenDate: number;
    openingUnitPrice: number;
    isReady: boolean;
    isOpened: boolean;
    isMatured: boolean;
    isPreOrderPeriod: boolean;
    isItayosePeriod: boolean;
    bestBorrowUnitPrice: number;
    bestLendUnitPrice: number;
    minBorrowUnitPrice: number;
    maxLendUnitPrice: number;
};

const emptyContract: { 0: LendingMarket } = {
    0: {
        name: 'EMPTY',
        maturity: 0,
        isActive: false,
        utcOpeningDate: 0,
        midUnitPrice: 0,
        preOpenDate: 0,
        openingUnitPrice: 0,
        isReady: false,
        isOpened: false,
        isMatured: false,
        isPreOrderPeriod: false,
        isItayosePeriod: false,
        bestBorrowUnitPrice: 0,
        bestLendUnitPrice: 0,
        minBorrowUnitPrice: 0,
        maxLendUnitPrice: 0,
    },
};

export enum MarketPhase {
    NOT_FOUND = 'Not Found',
    PRE_ORDER = 'Pre Order',
    ITAYOSE = 'Itayose',
    OPEN = 'Open',
    MATURED = 'Matured',
}

export const emptyContracts: AvailableContracts = {
    [CurrencySymbol.ETH]: emptyContract,
    [CurrencySymbol.WFIL]: emptyContract,
    [CurrencySymbol.USDC]: emptyContract,
    [CurrencySymbol.WBTC]: emptyContract,
};

export const emptyContract1: AvailableContracts = {
    [CurrencySymbol.ETH]: {},
    [CurrencySymbol.WFIL]: {},
    [CurrencySymbol.USDC]: {},
    [CurrencySymbol.WBTC]: {},
};

export type ContractMap = Record<number, LendingMarket>;
export type AvailableContracts = Record<CurrencySymbol, ContractMap>;

export const useLendingMarkets = () => {
    const securedFinance = useSF();
    const currencies = useMemo(
        () => getCurrencyMapAsList().map(currency => currency.toCurrency()),
        []
    );
    const currencyKey = useMemo(() => {
        return currencies.map(ccy => ccy.symbol).join('-');
    }, [currencies]);

    return useQuery({
        // eslint-disable-next-line @tanstack/query/exhaustive-deps
        queryKey: [QueryKeys.LENDING_MARKETS, currencyKey],
        queryFn: async () => {
            const lendingMarkets = await securedFinance?.getOrderBookDetails(
                currencies
            );
            return lendingMarkets ?? [];
        },
        select: markets => {
            const names: string[] = [];
            let availableContracts: AvailableContracts = emptyContracts;
            if (markets && markets.length > 0) {
                availableContracts = emptyContract1;
                markets.forEach(market => {
                    let name = market.name;
                    const {
                        maturity,
                        openingDate,
                        midUnitPrice,
                        openingUnitPrice,
                        isReady,
                        isOpened,
                        isMatured,
                        isPreOrderPeriod,
                        isItayosePeriod,
                        bestBorrowUnitPrice,
                        bestLendUnitPrice,
                        minBorrowUnitPrice,
                        maxLendUnitPrice,
                        ccy,
                    } = market;
                    const currency = fromBytes32(ccy) as CurrencySymbol;
                    let nameToPush = `${ccy}-${name}`;
                    if (names.includes(nameToPush)) {
                        // If the name already exists in the accumulator
                        // Increment the name by appending a number
                        let i = 1;
                        while (names.includes(`${ccy}-${name}-${i}`)) {
                            i++;
                        }
                        nameToPush = `${ccy}-${name}-${i}`;
                        name = `${name}-${i}`;
                    }
                    names.push(nameToPush);
                    availableContracts[currency] = {
                        ...availableContracts[currency],
                        [maturity.toNumber()]: {
                            name,
                            maturity: maturity.toNumber(),
                            utcOpeningDate: openingDate.toNumber(),
                            isActive: isPastDate(openingDate.toNumber()),
                            midUnitPrice: midUnitPrice.toNumber(),
                            openingUnitPrice: openingUnitPrice.toNumber(),
                            preOpenDate: openingDate.toNumber() - PRE_OPEN_TIME,
                            isReady,
                            isOpened,
                            isMatured,
                            isPreOrderPeriod,
                            isItayosePeriod,
                            bestBorrowUnitPrice: bestBorrowUnitPrice.toNumber(),
                            bestLendUnitPrice: bestLendUnitPrice.toNumber(),
                            minBorrowUnitPrice: minBorrowUnitPrice.toNumber(),
                            maxLendUnitPrice: maxLendUnitPrice.toNumber(),
                        },
                    };
                });
            }
            return availableContracts;
        },
        enabled: !!securedFinance,
    });
};

export const useSelectMarket = (currency: CurrencySymbol, maturity: number) => {
    const { data: lendingMarkets = emptyContracts } = useLendingMarkets();
    return lendingMarkets[currency][maturity];
};

export const useMarketPhase = (currency: CurrencySymbol, maturity: number) => {
    const market = useSelectMarket(currency, maturity);
    if (!market) {
        return MarketPhase.NOT_FOUND;
    }

    if (market.isPreOrderPeriod) {
        return MarketPhase.PRE_ORDER;
    }

    if (market.isItayosePeriod) {
        return MarketPhase.ITAYOSE;
    }

    if (market.isOpened) {
        return MarketPhase.OPEN;
    }

    if (market.isMatured) {
        return MarketPhase.MATURED;
    }

    return MarketPhase.NOT_FOUND;
};
