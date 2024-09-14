import { OrderSide } from '@secured-finance/sf-client';
import { toBytes32 } from '@secured-finance/sf-graph-client';
import queries from '@secured-finance/sf-graph-client/dist/graphclients';
import clsx from 'clsx';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { useCallback, useEffect, useMemo, useState } from 'react';
import DocumentTextIcon from 'src/assets/icons/document-text.svg';
import { MarketTab } from 'src/components/atoms';
import {
    CountdownTimer,
    CurrencyMaturityDropdown,
    PriceRateChange,
    Tooltip,
} from 'src/components/molecules';
import { MarketInfoDialog } from 'src/components/organisms';
import { useGraphClientHook, useIsSubgraphSupported } from 'src/hooks';
import useSF from 'src/hooks/useSecuredFinance';
import { HistoricalDataIntervals } from 'src/types';
import {
    CurrencySymbol,
    formatLoanValue,
    getTransformMaturityOption,
    handlePriceSource,
} from 'src/utils';
import { LoanValue, Maturity } from 'src/utils/entities';
import { AdvancedLendingTopBarProp } from './types';

dayjs.extend(duration);

export const AdvancedLendingTopBar = ({
    selectedAsset,
    assetList,
    options,
    selected,
    onAssetChange,
    onTermChange,
    currentMarket,
    currencyPrice,
    marketInfo,
}: AdvancedLendingTopBarProp) => {
    const securedFinance = useSF();
    const currentChainId = securedFinance?.config.chain.id;
    const isSubgraphSupported = useIsSubgraphSupported(currentChainId);
    const maturity = currentMarket?.value.maturity ?? 0;

    const [timestamp, setTimestamp] = useState<number>(1643713200);
    const [isMarketInfoDialogOpen, setIsMarketInfoDialogOpen] =
        useState<boolean>(false);

    const { data: lastTransaction } = useGraphClientHook(
        {
            currency: toBytes32(selectedAsset?.value as CurrencySymbol),
            maturity: maturity,
            from: -1,
            to: timestamp,
            sides: [OrderSide.LEND, OrderSide.BORROW],
        },
        queries.TransactionHistoryDocument,
        'lastTransaction',
        !isSubgraphSupported
    );

    const { data: historicalData } = useGraphClientHook(
        {
            interval: HistoricalDataIntervals['5M'],
            currency: toBytes32(selectedAsset?.value as CurrencySymbol),
            maturity: maturity,
        },
        queries.TransactionCandleStickDocument
    );

    const dailyStats = useMemo(() => {
        const data = historicalData?.transactionCandleSticks;
        if (!data || data.length === 0)
            return { percentageChange: null, absChange: null };

        const sortedData = [...data].sort(
            (a, b) => +b.timestamp - +a.timestamp
        );

        const latestTimestamp = parseInt(sortedData[0].timestamp);

        // Get today's 12 AM timestamp
        const todayMidnight = new Date();
        todayMidnight.setHours(0, 0, 0, 0);
        const todayMidnightTimestamp = Math.floor(
            todayMidnight.getTime() / 1000
        );

        let todaysLoanValue = null;
        for (const entry of sortedData) {
            if (+entry.timestamp >= todayMidnightTimestamp) {
                const price = parseFloat(entry.average);
                todaysLoanValue = LoanValue.fromPrice(price, maturity);
                break;
            }
        }

        const yesterdayTimestamp = latestTimestamp - 24 * 60 * 60;

        // Find the price from 24 hours ago
        let prevLoanValue = null;
        for (const entry of sortedData) {
            if (+entry.timestamp <= yesterdayTimestamp) {
                const price = parseFloat(entry.average);
                prevLoanValue = LoanValue.fromPrice(price, maturity);
                break;
            }
        }

        const todaysPrice = todaysLoanValue?.price;
        const prevPrice = prevLoanValue?.price;

        if (todaysPrice === undefined || prevPrice === undefined) {
            return { percentageChange: null, absChange: null };
        }

        const percentageChange = ((todaysPrice - prevPrice) / prevPrice) * 100;
        const absChange = (todaysPrice - prevPrice) / 100;

        return { percentageChange, absChange };
    }, [historicalData?.transactionCandleSticks, maturity]);

    const lastLoanValue = useMemo(() => {
        if (!lastTransaction || !lastTransaction.length) return undefined;

        const lastPrice = Number(lastTransaction?.[0]?.executionPrice);

        return LoanValue.fromPrice(lastPrice, maturity);
    }, [lastTransaction, maturity]);

    const selectedTerm = useMemo(
        () => options.find(o => o.value === selected.value),
        [options, selected]
    );

    useEffect(() => {
        setTimestamp(Math.round(new Date().getTime() / 1000));
    }, [selectedAsset, selectedTerm]);

    const handleTermChange = useCallback(
        (v: Maturity) => {
            onTermChange(v);
        },
        [onTermChange]
    );

    const onChange = (asset: CurrencySymbol, maturity: Maturity) => {
        handleTermChange(maturity);
        onAssetChange(asset);
    };

    return (
        <>
            <div>
                <div className='h-1 bg-starBlue'></div>
                <div className='border-white-10 laptop:border-x laptop:border-b laptop:bg-neutral-900'>
                    <div
                        className={clsx(
                            'grid grid-cols-12 gap-y-3 px-4 pb-[1.1875rem] pt-4 laptop:flex laptop:px-0 laptop:py-0'
                        )}
                    >
                        <div
                            className={clsx(
                                'col-span-12 grid grid-cols-12 gap-3 border-neutral-600 laptop:w-[25%] laptop:gap-y-0 laptop:border-r laptop:px-6 laptop:py-4',
                                marketInfo && 'tablet:gap-y-6'
                            )}
                        >
                            <div className='col-span-8 grid gap-x-3 gap-y-1 text-neutral-4 laptop:col-span-12 desktop:gap-x-5'>
                                <div className='flex flex-col items-start'>
                                    <div className='flex w-full flex-col gap-1'>
                                        <CurrencyMaturityDropdown
                                            asset={selectedAsset}
                                            currencyList={assetList}
                                            maturity={selectedTerm}
                                            maturityList={options}
                                            onChange={onChange}
                                        />
                                        <p className='whitespace-nowrap pl-1 text-[11px] leading-4 tablet:text-xs laptop:text-xs'>
                                            {`Maturity ${
                                                selectedTerm &&
                                                getTransformMaturityOption(
                                                    options.map(o => ({
                                                        ...o,
                                                        value: o.value.toString(),
                                                    }))
                                                )(selectedTerm.label)
                                            }`}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div
                                className={clsx(
                                    'col-span-4 flex justify-end pl-2 laptop:hidden',
                                    marketInfo && 'tablet:pl-0'
                                )}
                            >
                                <button
                                    data-testid='market-info-btn'
                                    onClick={() =>
                                        setIsMarketInfoDialogOpen(true)
                                    }
                                    className='flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-neutral-700 px-1 py-2'
                                >
                                    <DocumentTextIcon className='h-4 w-4 text-neutral-300' />
                                </button>
                            </div>
                        </div>

                        <div className='hidden justify-around laptop:flex laptop:w-[75%] laptop:items-center laptop:px-7 laptop:py-4 desktop:gap-3.5'>
                            <div className='flex w-[14%] flex-col desktop:w-[12%]'>
                                <span className='typography-caption-2 text-neutral-400'>
                                    Mark Price
                                </span>
                                <span className='typography-caption whitespace-nowrap font-semibold leading-4 text-neutral-50 desktop:leading-6'>
                                    {formatLoanValue(
                                        currentMarket?.value,
                                        'price'
                                    )}
                                </span>
                            </div>
                            <div className='flex w-[16%] flex-col desktop:w-[12%]'>
                                <MarketTab
                                    name='Last Price'
                                    value={formatLoanValue(
                                        lastLoanValue,
                                        'price'
                                    )}
                                />
                            </div>
                            <div className='flex w-[19%] flex-col desktop:w-[15%]'>
                                <MarketTab
                                    name='24h Price Change'
                                    value={
                                        <PriceRateChange
                                            percentageChange={
                                                dailyStats.percentageChange
                                            }
                                            absChange={dailyStats.absChange}
                                        />
                                    }
                                />
                            </div>
                            {marketInfo && (
                                <>
                                    <div className='hidden desktop:flex desktop:w-[11%]'>
                                        <MarketTab
                                            name='24h High'
                                            value={marketInfo.high}
                                        />
                                    </div>
                                    <div className='hidden desktop:flex desktop:w-[11%]'>
                                        <MarketTab
                                            name='24h Low'
                                            value={marketInfo.low}
                                        />
                                    </div>
                                    <div className='w-[13%] desktop:w-[12%]'>
                                        <section
                                            className='flex h-fit flex-grow flex-col'
                                            aria-label='24h Volume'
                                        >
                                            <span className='laptop:typography-caption-2 whitespace-nowrap text-[11px] text-neutral-400'>
                                                24h Volume
                                            </span>
                                            <Tooltip
                                                iconElement={
                                                    <span className='typography-caption flex items-center whitespace-nowrap leading-4 text-neutral-50 desktop:leading-6'>
                                                        {marketInfo?.volume}
                                                    </span>
                                                }
                                            >
                                                <span>
                                                    24h Vol:{' '}
                                                    {marketInfo?.volumeInUSD}
                                                </span>
                                            </Tooltip>
                                        </section>
                                    </div>
                                </>
                            )}
                            <div className={clsx('w-[15%] desktop:w-[11%]')}>
                                <MarketTab
                                    name={`${selectedAsset?.value} Price`}
                                    value={currencyPrice || '0'}
                                    source={handlePriceSource(
                                        selectedAsset?.value
                                    )}
                                />
                            </div>
                            <div className='flex flex-col laptop:w-[13%] desktop:w-[10%]'>
                                <CountdownTimer
                                    maturity={selected.value.toNumber()}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <MarketInfoDialog
                isOpen={isMarketInfoDialogOpen}
                onClose={() => setIsMarketInfoDialogOpen(false)}
                currency={selectedAsset?.value}
                currentMarket={currentMarket}
                currencyPrice={currencyPrice || '0'}
                marketInfo={marketInfo}
                lastLoanValue={lastLoanValue}
                percentageChange={dailyStats.percentageChange}
                absChange={dailyStats.absChange}
            />
        </>
    );
};
