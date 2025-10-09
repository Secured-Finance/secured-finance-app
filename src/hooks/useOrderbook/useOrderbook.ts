import { toBytes32 } from '@secured-finance/sf-graph-client';
import { DefaultError, useQuery, UseQueryResult } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useLendingMarketReaderRead } from 'src/generated/wagmi';
import { QueryKeys } from 'src/hooks/queries';
import useSF from 'src/hooks/useSecuredFinance';
import {
    CurrencySymbol,
    toCurrency,
    useHookSwitcher,
    ZERO_BI,
} from 'src/utils';
import { LoanValue } from 'src/utils/entities';

const DEFAULT_ORDERBOOK_DEPTH = 30;

interface SmartContractOrderbook {
    unitPrices: bigint[];
    amounts: bigint[];
    quantities: bigint[];
    next: bigint;
}

export type OrderBookEntry = {
    amount: bigint;
    value: LoanValue;
    cumulativeAmount: bigint;
};

export type OrderBook = Array<OrderBookEntry>;

export const sortOrders = (
    a: OrderBookEntry,
    b: OrderBookEntry,
    order: 'asc' | 'desc'
) => {
    return order === 'asc'
        ? a.value.price - b.value.price
        : b.value.price - a.value.price;
};

const transformOrderbook = (
    input: SmartContractOrderbook,
    maturity: number,
    calculationDate: number | undefined,
    startPrice?: bigint,
    amount?: bigint
): OrderBook => {
    return input.unitPrices.map((unitPrice, index) => {
        return {
            amount:
                startPrice && amount && unitPrice === startPrice
                    ? amount
                    : input.amounts[index],
            value: LoanValue.fromPrice(
                Number(unitPrice),
                maturity,
                calculationDate
            ),
            cumulativeAmount: ZERO_BI,
        };
    });
};

// Legacy implementation using secured finance SDK
const useOrderbookLegacy = (
    ccy: CurrencySymbol,
    maturity: number,
    calculationDate?: number,
    borrowStartPrice?: bigint,
    borrowAmount?: bigint,
    lendStartPrice?: bigint,
    lendAmount?: bigint
) => {
    const securedFinance = useSF();
    const [depth, setDepth] = useState(DEFAULT_ORDERBOOK_DEPTH);
    const [multiplier, setMultiplier] = useState(1);
    const [isShowingAll, setIsShowingAll] = useState(true);

    useEffect(() => {
        setDepth(
            (DEFAULT_ORDERBOOK_DEPTH * multiplier) / (isShowingAll ? 2 : 1)
        );
    }, [isShowingAll, multiplier]);

    return [
        useQuery({
            queryKey: [
                QueryKeys.ORDER_BOOK,
                ccy,
                maturity,
                depth,
                borrowStartPrice,
                lendStartPrice,
            ],
            queryFn: async () => {
                const currency = toCurrency(ccy);
                const [borrowOrderbook, lendOrderbook] = await Promise.all([
                    securedFinance?.getBorrowOrderBook(
                        currency,
                        maturity,
                        Number(borrowStartPrice ?? ZERO_BI),
                        depth
                    ),
                    securedFinance?.getLendOrderBook(
                        currency,
                        maturity,
                        Number(lendStartPrice ?? ZERO_BI),
                        depth
                    ),
                ]);

                return {
                    lendOrderbook: {
                        unitPrices: lendOrderbook?.unitPrices ?? [],
                        amounts: lendOrderbook?.amounts ?? [],
                        quantities: lendOrderbook?.quantities ?? [],
                        next: lendOrderbook?.next ?? ZERO_BI,
                    },
                    borrowOrderbook: {
                        unitPrices: borrowOrderbook?.unitPrices ?? [],
                        amounts: borrowOrderbook?.amounts ?? [],
                        quantities: borrowOrderbook?.quantities ?? [],
                        next: borrowOrderbook?.next ?? ZERO_BI,
                    },
                };
            },
            select: data => {
                return {
                    borrowOrderbook: transformOrderbook(
                        data.borrowOrderbook as SmartContractOrderbook,
                        maturity,
                        calculationDate,
                        borrowStartPrice,
                        borrowAmount
                    ),
                    lendOrderbook: transformOrderbook(
                        data.lendOrderbook as SmartContractOrderbook,
                        maturity,
                        calculationDate,
                        lendStartPrice,
                        lendAmount
                    ),
                };
            },
            enabled: !!securedFinance,
        }),
        setMultiplier,
        setIsShowingAll,
    ] as const;
};

// New wagmi implementation using generated hooks
const useOrderbookWagmi = (
    ccy: CurrencySymbol,
    maturity: number,
    calculationDate?: number,
    borrowStartPrice?: bigint,
    borrowAmount?: bigint,
    lendStartPrice?: bigint,
    lendAmount?: bigint
) => {
    const [depth, setDepth] = useState(DEFAULT_ORDERBOOK_DEPTH);
    const [multiplier, setMultiplier] = useState(1);
    const [isShowingAll, setIsShowingAll] = useState(true);

    useEffect(() => {
        setDepth(
            (DEFAULT_ORDERBOOK_DEPTH * multiplier) / (isShowingAll ? 2 : 1)
        );
    }, [isShowingAll, multiplier]);

    const {
        data: borrowOrderbookData,
        isLoading: borrowIsLoading,
        error: borrowError,
    } = useLendingMarketReaderRead({
        functionName: 'getBorrowOrderBook',
        args: [
            toBytes32(ccy),
            BigInt(maturity),
            borrowStartPrice ?? ZERO_BI,
            BigInt(depth),
        ],
    });

    const {
        data: lendOrderbookData,
        isLoading: lendIsLoading,
        error: lendError,
    } = useLendingMarketReaderRead({
        functionName: 'getLendOrderBook',
        args: [
            toBytes32(ccy),
            BigInt(maturity),
            lendStartPrice ?? ZERO_BI,
            BigInt(depth),
        ],
    });

    const transformedData = useMemo(() => {
        if (!borrowOrderbookData || !lendOrderbookData) return undefined;

        const borrowOrderbook = transformOrderbook(
            {
                unitPrices: borrowOrderbookData[0],
                amounts: borrowOrderbookData[1],
                quantities: borrowOrderbookData[2],
                next: borrowOrderbookData[3],
            } as SmartContractOrderbook,
            maturity,
            calculationDate,
            borrowStartPrice,
            borrowAmount
        );

        const lendOrderbook = transformOrderbook(
            {
                unitPrices: lendOrderbookData[0],
                amounts: lendOrderbookData[1],
                quantities: lendOrderbookData[2],
                next: lendOrderbookData[3],
            } as SmartContractOrderbook,
            maturity,
            calculationDate,
            lendStartPrice,
            lendAmount
        );

        return {
            borrowOrderbook,
            lendOrderbook,
        };
    }, [
        borrowOrderbookData,
        lendOrderbookData,
        maturity,
        calculationDate,
        borrowStartPrice,
        borrowAmount,
        lendStartPrice,
        lendAmount,
    ]);

    return [
        {
            data: transformedData,
            isPending: borrowIsLoading || lendIsLoading,
            error: borrowError || lendError,
        } as UseQueryResult<
            {
                borrowOrderbook: OrderBook;
                lendOrderbook: OrderBook;
            },
            DefaultError
        >,
        setMultiplier,
        setIsShowingAll,
    ] as const;
};

// Main hook with feature flag switching
export const useOrderbook = (
    ccy: CurrencySymbol,
    maturity: number,
    calculationDate?: number,
    borrowStartPrice?: bigint,
    borrowAmount?: bigint,
    lendStartPrice?: bigint,
    lendAmount?: bigint
) => {
    const legacyResult = useOrderbookLegacy(
        ccy,
        maturity,
        calculationDate,
        borrowStartPrice,
        borrowAmount,
        lendStartPrice,
        lendAmount
    );
    const wagmiResult = useOrderbookWagmi(
        ccy,
        maturity,
        calculationDate,
        borrowStartPrice,
        borrowAmount,
        lendStartPrice,
        lendAmount
    );

    return useHookSwitcher(
        () => legacyResult,
        () => wagmiResult
    );
};

// Legacy implementation using secured finance SDK
const useBorrowOrderBookLegacy = (
    ccy: CurrencySymbol,
    maturity: number,
    lastBorrowPrice: number
) => {
    const securedFinance = useSF();

    return useQuery({
        queryKey: [QueryKeys.BORROW_ORDER_BOOK, ccy, maturity, lastBorrowPrice],
        queryFn: async () => {
            let res = ZERO_BI;
            const currency = toCurrency(ccy);
            let borrowOrderBook: SmartContractOrderbook = {
                unitPrices: [],
                amounts: [],
                quantities: [],
                next: ZERO_BI,
            };
            do {
                const orderBook = (await securedFinance?.getBorrowOrderBook(
                    currency,
                    maturity,
                    Number(borrowOrderBook.next),
                    1000
                )) as SmartContractOrderbook;
                borrowOrderBook = {
                    unitPrices: borrowOrderBook.unitPrices.concat(
                        orderBook.unitPrices
                    ),
                    amounts: borrowOrderBook.amounts.concat(orderBook.amounts),
                    quantities: borrowOrderBook.quantities.concat(
                        orderBook.quantities
                    ),
                    next: orderBook.next,
                };
            } while (
                borrowOrderBook.next !== ZERO_BI &&
                lastBorrowPrice >= borrowOrderBook.next
            );

            borrowOrderBook.unitPrices.forEach((unitPrice, index) => {
                if (lastBorrowPrice >= unitPrice) {
                    res += borrowOrderBook.amounts[index];
                }
            });
            return res;
        },
        enabled: !!securedFinance && !!ccy && !!maturity && !!lastBorrowPrice,
    });
};

// New wagmi implementation using generated hooks
const useBorrowOrderBookWagmi = (
    ccy: CurrencySymbol,
    maturity: number,
    lastBorrowPrice: number
) => {
    // Start with initial parameters and paginate as needed
    const [allBorrowData, setAllBorrowData] = useState<SmartContractOrderbook>({
        unitPrices: [],
        amounts: [],
        quantities: [],
        next: ZERO_BI,
    });

    const {
        data: borrowOrderbookData,
        isLoading,
        error,
    } = useLendingMarketReaderRead({
        functionName: 'getBorrowOrderBook',
        args: [
            toBytes32(ccy),
            BigInt(maturity),
            allBorrowData.next,
            BigInt(1000),
        ],
    });

    const result = useMemo(() => {
        if (!borrowOrderbookData) return ZERO_BI;

        let res = ZERO_BI;
        const [unitPrices, amounts] = borrowOrderbookData;
        const allUnitPrices = [...allBorrowData.unitPrices, ...unitPrices];
        const allAmounts = [...allBorrowData.amounts, ...amounts];

        allUnitPrices.forEach((unitPrice, index) => {
            if (lastBorrowPrice >= Number(unitPrice)) {
                res += allAmounts[index];
            }
        });

        return res;
    }, [allBorrowData, borrowOrderbookData, lastBorrowPrice]);

    // Handle pagination logic
    useEffect(() => {
        if (borrowOrderbookData) {
            const [unitPrices, amounts, quantities, next] = borrowOrderbookData;
            if (BigInt(next) !== ZERO_BI && lastBorrowPrice >= Number(next)) {
                setAllBorrowData(prev => ({
                    unitPrices: [...prev.unitPrices, ...unitPrices],
                    amounts: [...prev.amounts, ...amounts],
                    quantities: [...prev.quantities, ...quantities],
                    next: BigInt(next),
                }));
            }
        }
    }, [borrowOrderbookData, lastBorrowPrice]);

    return {
        data: result,
        isPending: isLoading,
        error,
    } as UseQueryResult<bigint, DefaultError>;
};

// Main hook with feature flag switching
export const useBorrowOrderBook = (
    ccy: CurrencySymbol,
    maturity: number,
    lastBorrowPrice: number
) => {
    const legacyResult = useBorrowOrderBookLegacy(
        ccy,
        maturity,
        lastBorrowPrice
    );
    const wagmiResult = useBorrowOrderBookWagmi(ccy, maturity, lastBorrowPrice);

    return useHookSwitcher(
        () => legacyResult,
        () => wagmiResult
    );
};

// Legacy implementation using secured finance SDK
const useLendOrderBookLegacy = (
    ccy: CurrencySymbol,
    maturity: number,
    lastLendPrice: number
) => {
    const securedFinance = useSF();

    return useQuery({
        queryKey: [QueryKeys.LEND_ORDER_BOOK, ccy, maturity, lastLendPrice],
        queryFn: async () => {
            let res = ZERO_BI;
            const currency = toCurrency(ccy);
            let lendOrderBook: SmartContractOrderbook = {
                unitPrices: [],
                amounts: [],
                quantities: [],
                next: ZERO_BI,
            };
            do {
                const orderBook = (await securedFinance?.getLendOrderBook(
                    currency,
                    maturity,
                    Number(lendOrderBook.next),
                    1000
                )) as SmartContractOrderbook;
                lendOrderBook = {
                    unitPrices: lendOrderBook.unitPrices.concat(
                        orderBook.unitPrices
                    ),
                    amounts: lendOrderBook.amounts.concat(orderBook.amounts),
                    quantities: lendOrderBook.quantities.concat(
                        orderBook.quantities
                    ),
                    next: orderBook.next,
                };
            } while (
                lendOrderBook.next !== ZERO_BI &&
                lendOrderBook.next >= lastLendPrice
            );

            lendOrderBook.unitPrices.forEach((unitPrice, index) => {
                if (unitPrice >= lastLendPrice) {
                    res += lendOrderBook.amounts[index];
                }
            });
            return res;
        },
        enabled: !!securedFinance && !!ccy && !!maturity && !!lastLendPrice,
    });
};

// New wagmi implementation using generated hooks
const useLendOrderBookWagmi = (
    ccy: CurrencySymbol,
    maturity: number,
    lastLendPrice: number
) => {
    // Start with initial parameters and paginate as needed
    const [allLendData, setAllLendData] = useState<SmartContractOrderbook>({
        unitPrices: [],
        amounts: [],
        quantities: [],
        next: ZERO_BI,
    });

    const {
        data: lendOrderbookData,
        isLoading,
        error,
    } = useLendingMarketReaderRead({
        functionName: 'getLendOrderBook',
        args: [
            toBytes32(ccy),
            BigInt(maturity),
            allLendData.next,
            BigInt(1000),
        ],
    });

    const result = useMemo(() => {
        if (!lendOrderbookData) return ZERO_BI;

        let res = ZERO_BI;
        const [unitPrices, amounts] = lendOrderbookData;
        const allUnitPrices = [...allLendData.unitPrices, ...unitPrices];
        const allAmounts = [...allLendData.amounts, ...amounts];

        allUnitPrices.forEach((unitPrice, index) => {
            if (Number(unitPrice) >= lastLendPrice) {
                res += allAmounts[index];
            }
        });

        return res;
    }, [allLendData, lendOrderbookData, lastLendPrice]);

    // Handle pagination logic
    useEffect(() => {
        if (lendOrderbookData) {
            const [unitPrices, amounts, quantities, next] = lendOrderbookData;
            if (BigInt(next) !== ZERO_BI && Number(next) >= lastLendPrice) {
                setAllLendData(prev => ({
                    unitPrices: [...prev.unitPrices, ...unitPrices],
                    amounts: [...prev.amounts, ...amounts],
                    quantities: [...prev.quantities, ...quantities],
                    next: BigInt(next),
                }));
            }
        }
    }, [lendOrderbookData, lastLendPrice]);

    return {
        data: result,
        isPending: isLoading,
        error,
    } as UseQueryResult<bigint, DefaultError>;
};

// Main hook with feature flag switching
export const useLendOrderBook = (
    ccy: CurrencySymbol,
    maturity: number,
    lastLendPrice: number
) => {
    const legacyResult = useLendOrderBookLegacy(ccy, maturity, lastLendPrice);
    const wagmiResult = useLendOrderBookWagmi(ccy, maturity, lastLendPrice);

    return useHookSwitcher(
        () => legacyResult,
        () => wagmiResult
    );
};
