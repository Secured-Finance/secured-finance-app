import { toBytes32 } from '@secured-finance/sf-graph-client';
import queries from '@secured-finance/sf-graph-client/dist/graphclients/';
import { BigNumber } from 'ethers';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    AdvancedLendingTopBar,
    HorizontalTab,
    Tab,
} from 'src/components/molecules';
import {
    AdvancedLendingOrderCard,
    LineChartTab,
    OrderBookWidget,
    OrderTable,
} from 'src/components/organisms';
import { ThreeColumnsWithTopBar } from 'src/components/templates';
import {
    CollateralBook,
    emptyOrderList,
    useCurrenciesForOrders,
    useGraphClientHook,
    useMarket,
    useOrderList,
} from 'src/hooks';
import { useOrderbook } from 'src/hooks/useOrderbook';
import { getAssetPrice } from 'src/store/assetPrices/selectors';
import {
    resetUnitPrice,
    selectLandingOrderForm,
    setAmount,
    setCurrency,
    setMaturity,
} from 'src/store/landingOrderForm';
import { RootState } from 'src/store/types';
import { MaturityOptionList, TransactionList } from 'src/types';
import {
    CurrencySymbol,
    Rate,
    amountFormatterFromBase,
    amountFormatterToBase,
    currencyMap,
    formatLoanValue,
    getCurrencyMapAsOptions,
    hexToCurrencySymbol,
    ordinaryFormat,
    usdFormat,
} from 'src/utils';
import { LoanValue, Maturity } from 'src/utils/entities';
import { useAccount } from 'wagmi';

const useTradeHistoryDetails = (
    transactions: TransactionList,
    currency: CurrencySymbol,
    maturity: Maturity
) => {
    return useMemo(() => {
        let min = 10000;
        let max = 0;
        let sum = BigNumber.from(0);
        let count = 0;
        if (!transactions.length) {
            min = 0;
            max = 0;
        }
        for (const t of transactions) {
            const price = t.averagePrice * 10000;
            if (price < min) min = price;
            if (price > max) max = price;
            sum = sum.add(BigNumber.from(t.amount));
            count++;
        }

        return {
            min: LoanValue.fromPrice(min, maturity.toNumber()),
            max: LoanValue.fromPrice(max, maturity.toNumber()),
            sum: currencyMap[currency].fromBaseUnit(sum),
            count,
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currency, maturity.toNumber(), transactions.length]);
};

export const AdvancedLending = ({
    collateralBook,
    maturitiesOptionList,
    rates,
    marketPrice,
}: {
    collateralBook: CollateralBook;
    maturitiesOptionList: MaturityOptionList;
    rates: Rate[];
    marketPrice: number | undefined;
}) => {
    const { amount, currency, maturity } = useSelector((state: RootState) =>
        selectLandingOrderForm(state.landingOrderForm)
    );

    const currencyPrice = useSelector((state: RootState) =>
        getAssetPrice(currency)(state)
    );

    const { address } = useAccount();
    const dispatch = useDispatch();
    const assetList = useMemo(() => getCurrencyMapAsOptions(), []);

    const [timestamp, setTimestamp] = useState<number>(1643713200);
    useEffect(() => {
        setTimestamp(Math.round(new Date().getTime() / 1000));
    }, []);

    const selectedTerm = useMemo(() => {
        return (
            maturitiesOptionList.find(option =>
                option.value.equals(new Maturity(maturity))
            ) || maturitiesOptionList[0]
        );
    }, [maturity, maturitiesOptionList]);

    const openingUnitPrice = useMarket(currency, maturity)?.openingUnitPrice;

    const orderBook = useOrderbook(currency, maturity, 10, 10);
    const { data: usedCurrencies = [] } = useCurrenciesForOrders(address);
    const { data: orderList = emptyOrderList } = useOrderList(
        address,
        usedCurrencies
    );
    const filteredOrderList = useMemo(() => {
        return orderList.activeOrderList.filter(
            order =>
                hexToCurrencySymbol(order.currency) === currency &&
                order.maturity === maturity.toString()
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currency, maturity, JSON.stringify(orderList.activeOrderList)]);

    const transactionHistory = useGraphClientHook(
        {
            currency: toBytes32(currency),
            maturity: maturity,
            from: timestamp - 24 * 3600,
            to: timestamp,
        },
        queries.TransactionHistoryDocument
    ).data;

    const tradeHistoryDetails = useTradeHistoryDetails(
        transactionHistory?.transactionHistory ?? [],
        currency,
        selectedTerm.value
    );

    const lastTransaction = useMemo(() => {
        // if there is no transaction, return the lending market opening price
        if (!transactionHistory?.lastTransaction?.length)
            return {
                createdAt: 0,
                value: openingUnitPrice
                    ? LoanValue.fromPrice(openingUnitPrice, maturity)
                    : undefined,
            };
        return {
            createdAt: transactionHistory?.lastTransaction[0]?.createdAt,
            value: LoanValue.fromPrice(
                transactionHistory?.lastTransaction[0]?.averagePrice * 10000,
                maturity
            ),
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [maturity, transactionHistory?.lastTransaction, openingUnitPrice]);

    const selectedAsset = useMemo(() => {
        return assetList.find(option => option.value === currency);
    }, [currency, assetList]);

    const handleCurrencyChange = useCallback(
        (v: CurrencySymbol) => {
            let formatFrom = (x: BigNumber) => x.toNumber();
            if (amountFormatterFromBase && amountFormatterFromBase[currency]) {
                formatFrom = amountFormatterFromBase[currency];
            }
            let formatTo = (x: number) => BigNumber.from(x);
            if (amountFormatterToBase && amountFormatterToBase[v]) {
                formatTo = amountFormatterToBase[v];
            }
            dispatch(setAmount(formatTo(formatFrom(amount))));
            dispatch(setCurrency(v));
            dispatch(resetUnitPrice());
        },
        [amount, currency, dispatch]
    );

    const handleTermChange = useCallback(
        (v: string) => {
            dispatch(setMaturity(Number(v)));
            dispatch(resetUnitPrice());
        },
        [dispatch]
    );

    return (
        <ThreeColumnsWithTopBar
            topBar={
                <AdvancedLendingTopBar
                    selectedAsset={selectedAsset}
                    assetList={assetList}
                    options={maturitiesOptionList.map(o => ({
                        label: o.label,
                        value: o.value.toString(),
                    }))}
                    selected={{
                        label: selectedTerm.label,
                        value: selectedTerm.value.toString(),
                    }}
                    onAssetChange={handleCurrencyChange}
                    onTermChange={handleTermChange}
                    lastTradeLoan={lastTransaction.value}
                    lastTradeTime={lastTransaction.createdAt}
                    values={[
                        formatLoanValue(tradeHistoryDetails.max, 'price'),
                        formatLoanValue(tradeHistoryDetails.min, 'price'),
                        tradeHistoryDetails.count,
                        tradeHistoryDetails.sum
                            ? ordinaryFormat(tradeHistoryDetails.sum)
                            : '-',
                        usdFormat(currencyPrice, 2),
                    ]}
                />
            }
        >
            <AdvancedLendingOrderCard
                collateralBook={collateralBook}
                marketPrice={marketPrice}
            />

            <OrderBookWidget orderbook={orderBook} currency={currency} />

            <div className='flex flex-grow flex-col gap-6'>
                <Tab tabDataArray={[{ text: 'Yield Curve' }]}>
                    <LineChartTab
                        maturitiesOptionList={maturitiesOptionList}
                        rates={rates}
                    />
                </Tab>
                <HorizontalTab tabTitles={['Open Orders']}>
                    <OrderTable data={filteredOrderList} />
                </HorizontalTab>
            </div>
        </ThreeColumnsWithTopBar>
    );
};
