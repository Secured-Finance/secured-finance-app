import { fromBytes32 } from '@secured-finance/sf-graph-client';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { QueryKeys } from 'src/hooks/queries';
import useSF from 'src/hooks/useSecuredFinance';
import { CurrencySymbol, getCurrencyMapAsList } from 'src/utils';
import { isPastDate } from 'src/utils/date';

const PRE_OPEN_TIME = 60 * 60 * 24 * 7; // 7 days in seconds

export type LendingMarket = {
    name: string;
    maturity: number;
    isActive: boolean;
    utcOpeningDate: number;
    marketUnitPrice: number;
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
    lastOrderBlockNumber: number;
    blockUnitPriceHistory: number[];
};

const baseContract: { 0: LendingMarket } = {
    0: {
        name: 'EMPTY',
        maturity: 0,
        isActive: false,
        utcOpeningDate: 0,
        marketUnitPrice: 0,
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
        lastOrderBlockNumber: 0,
        blockUnitPriceHistory: [],
    },
};

export const baseContracts: AvailableContracts = {
    [CurrencySymbol.ETH]: baseContract,
    [CurrencySymbol.WFIL]: baseContract,
    [CurrencySymbol.USDC]: baseContract,
    [CurrencySymbol.WBTC]: baseContract,
};

const emptyContracts: AvailableContracts = {
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
            let availableContracts: AvailableContracts = baseContracts;
            if (markets && markets.length > 0) {
                availableContracts = emptyContracts;
                markets.forEach(market => {
                    let name = market.name;
                    const {
                        maturity,
                        openingDate,
                        marketUnitPrice,
                        openingUnitPrice,
                        blockUnitPriceHistory,
                        lastOrderBlockNumber,
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
                        // if ccy-name already exists in the accumulator increment the ccy-name by appending a number
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
                            marketUnitPrice: marketUnitPrice.toNumber(),
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
                            lastOrderBlockNumber:
                                lastOrderBlockNumber.toNumber(),
                            blockUnitPriceHistory: blockUnitPriceHistory.map(
                                price => price.toNumber()
                            ),
                        },
                    };
                });
            }
            return availableContracts;
        },
        enabled: !!securedFinance,
    });
};
