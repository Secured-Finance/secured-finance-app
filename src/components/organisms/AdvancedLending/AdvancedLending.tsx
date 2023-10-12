import { toBytes32 } from '@secured-finance/sf-graph-client';
import queries from '@secured-finance/sf-graph-client/dist/graphclients/';
import { BigNumber } from 'ethers';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DelistingChip } from 'src/components/atoms';
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
    useCurrencyDelistedStatus,
    useGraphClientHook,
    useMarket,
    useMarketOrderList,
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

const DEFAULT_ORDERBOOK_DEPTH = 12;
const DEFAULT_ORDERBOOK_DEPTH_FULL = 26;

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
    const ccyStatus = useCurrencyDelistedStatus();
    const assetList = useMemo(
        () => getCurrencyMapAsOptions(ccyStatus.data),
        [ccyStatus]
    );

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

    const data = useMarket(currency, maturity);
    const marketUnitPrice = data?.marketUnitPrice;
    const openingUnitPrice = data?.openingUnitPrice;

    const [orderBook, setOrderBookDepth] = useOrderbook(
        currency,
        maturity,
        DEFAULT_ORDERBOOK_DEPTH
    );
    const filteredOrderList = useMarketOrderList(address, currency, maturity);

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

    const currentMarket = useMemo(() => {
        if (marketUnitPrice) {
            return {
                value: LoanValue.fromPrice(marketUnitPrice, maturity),
                // TODO: get the time from the block
                time: 0,
                type: 'block' as const,
            };
        }
        if (openingUnitPrice) {
            return {
                value: LoanValue.fromPrice(openingUnitPrice, maturity),
                time: 0,
                type: 'opening' as const,
            };
        }
    }, [marketUnitPrice, maturity, openingUnitPrice]);

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
                    assetList={assetList.map(o => ({
                        ...o,
                        ...(o.delisted ? { chip: <DelistingChip /> } : {}),
                    }))}
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
                    currentMarket={currentMarket}
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

            <OrderBookWidget
                orderbook={orderBook}
                currency={currency}
                marketPrice={currentMarket?.value}
                onFilterChange={state => {
                    setOrderBookDepth(
                        !state.showBorrow || !state.showLend
                            ? DEFAULT_ORDERBOOK_DEPTH_FULL
                            : DEFAULT_ORDERBOOK_DEPTH
                    );
                }}
            />

            <div className='flex h-full flex-grow flex-col gap-4'>
                <Tab tabDataArray={[{ text: 'Yield Curve' }]}>
                    <LineChartTab
                        maturitiesOptionList={maturitiesOptionList}
                        rates={rates}
                    />
                </Tab>
                <HorizontalTab tabTitles={['Open Orders']}>
                    <OrderTable
                        data={filteredOrderList}
                        variant='compact'
                        height={350}
                    />
                </HorizontalTab>
            </div>
        </ThreeColumnsWithTopBar>
    );
};
