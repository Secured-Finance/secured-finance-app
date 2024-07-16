import { toBytes32 } from '@secured-finance/sf-graph-client';
import queries from '@secured-finance/sf-graph-client/dist/graphclients';
import clsx from 'clsx';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { useEffect, useMemo, useState } from 'react';
import DocumentTextIcon from 'src/assets/icons/document-text.svg';
import { MarketTab } from 'src/components/atoms';
import { HorizontalAssetSelector } from 'src/components/molecules';
import { MarketInfoDialog } from 'src/components/organisms';
import { useGraphClientHook, useIsSubgraphSupported } from 'src/hooks';
import useSF from 'src/hooks/useSecuredFinance';
import { percentFormat } from 'src/utils';

import {
    COIN_GECKO_SOURCE,
    CurrencySymbol,
    currencyMap,
    formatLoanValue,
    formatRemainingTime,
    formatTimeStampWithTimezone,
} from 'src/utils';
import { LoanValue } from 'src/utils/entities';
import { AdvancedLendingTopBarProp } from './types';

dayjs.extend(duration);

export const AdvancedLendingTopBar = <T extends string = string>({
    selectedAsset,
    assetList,
    options,
    selected,
    onAssetChange,
    onTermChange,
    currentMarket,
    currencyPrice,
    marketInfo,
}: AdvancedLendingTopBarProp<T>) => {
    const securedFinance = useSF();
    const currentChainId = securedFinance?.config.chain.id;
    const isSubgraphSupported = useIsSubgraphSupported(currentChainId);
    const maturity = currentMarket?.value.maturity ?? 0;

    const [timestamp, setTimestamp] = useState<number>(1643713200);
    const [isMarketInfoDialogOpen, setIsMarketInfoDialogOpen] =
        useState<boolean>(false);
    const [remainingTime, setRemainingTime] = useState<number>(
        maturity - dayjs().unix()
    );

    const priceHigh = marketInfo?.high;
    const priceLow = marketInfo?.low;
    const rateHigh = marketInfo?.rateHigh;
    const rateLow = marketInfo?.rateLow;

    const getTime = () => {
        if (currentMarket) {
            if (currentMarket.type === 'opening') {
                return 'Opening Price';
            } else {
                return formatTimeStampWithTimezone(currentMarket.time);
            }
        }
        return '-';
    };

    const allTransactions = useGraphClientHook(
        {
            currency: toBytes32(selectedAsset?.value as string),
            maturity: maturity,
            from: -1,
            to: timestamp,
        },
        queries.TransactionHistoryDocument,
        'transactionHistory',
        !isSubgraphSupported
    ).data;

    const lastLoanValue = useMemo(() => {
        const lastPrice = allTransactions?.[0]
            ? allTransactions[0]?.averagePrice * 10000
            : 0;
        return LoanValue.fromPrice(lastPrice, maturity);
    }, [allTransactions, maturity]);

    const PriceRateChange = () => {
        const invalidPercentage = '-.--%';

        if (
            !priceHigh ||
            !priceLow ||
            !rateHigh ||
            !rateLow ||
            marketInfo?.isIncreased === undefined
        ) {
            return (
                <div className='flex items-center gap-1'>
                    <span>{invalidPercentage}</span>
                    <span>({invalidPercentage})</span>
                </div>
            );
        }

        const high = parseFloat(priceHigh as string);
        const low = parseFloat(priceLow as string);
        const rateHighParsed = parseFloat(rateHigh as string);
        const rateLowParsed = parseFloat(rateLow as string);

        if (
            isNaN(high) ||
            isNaN(low) ||
            isNaN(rateHighParsed) ||
            isNaN(rateLowParsed)
        ) {
            return (
                <div className='flex items-center gap-1'>
                    <span>{invalidPercentage}</span>
                    <span>({invalidPercentage})</span>
                </div>
            );
        }

        // Handle case where both values are 0.00
        if (high === 0 && low === 0) {
            return (
                <div className='flex items-center gap-1'>
                    <span>0.00%</span>
                    <span>(0.00%)</span>
                </div>
            );
        }

        // Handle case where both rates are 0.00%
        if (rateHighParsed === 0 && rateLowParsed === 0) {
            return (
                <div className='flex items-center gap-1'>
                    <span>0.00%</span>
                    <span>(0.00%)</span>
                </div>
            );
        }

        let percentageChange: number;
        let ratePercentageChange: number;

        if (marketInfo?.isIncreased) {
            if (low === 0 || rateLowParsed === 0) {
                return (
                    <div className='flex items-center gap-1'>
                        <span>{invalidPercentage}</span>
                        <span>({invalidPercentage})</span>
                    </div>
                );
            }
            percentageChange = ((high - low) / low) * 100;
            ratePercentageChange =
                ((rateHighParsed - rateLowParsed) / rateLowParsed) * 100;
        } else {
            if (high === 0 || rateHighParsed === 0) {
                return (
                    <div className='flex items-center gap-1'>
                        <span>{invalidPercentage}</span>
                        <span>({invalidPercentage})</span>
                    </div>
                );
            }
            percentageChange = ((low - high) / high) * 100;
            ratePercentageChange =
                ((rateLowParsed - rateHighParsed) / rateHighParsed) * 100;
        }

        const formattedPercentage = percentFormat(percentageChange, 100, 2, 2);
        const formattedRatePercentage = percentFormat(
            ratePercentageChange,
            100,
            2,
            2
        );
        const sign = marketInfo?.isIncreased ? '+' : '-';

        return (
            <div className='flex items-center gap-1'>
                <span>
                    {sign}
                    {formattedPercentage}
                </span>
                <span>
                    ({sign} {formattedRatePercentage})
                </span>
            </div>
        );
    };

    useEffect(() => {
        const updateCountdown = () => {
            const now = dayjs().unix();
            const timeLeft = maturity - now;

            if (timeLeft <= 0) {
                setRemainingTime(0);
                clearInterval(interval);
                return;
            }

            setRemainingTime(timeLeft);
        };

        const interval = setInterval(updateCountdown, 1000);
        updateCountdown();

        return () => clearInterval(interval);
    }, [maturity]);

    useEffect(() => {
        setTimestamp(Math.round(new Date().getTime() / 1000));
    }, []);

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
                        <section
                            className={clsx(
                                'col-span-12 grid grid-cols-12 gap-3 border-neutral-600 laptop:w-[25%] laptop:gap-y-0 laptop:border-r laptop:px-6 laptop:py-4',
                                marketInfo && 'tablet:gap-y-6'
                            )}
                        >
                            <div
                                className={clsx(
                                    'col-span-10 laptop:col-span-12 laptop:pr-0'
                                )}
                            >
                                {/* TODO: replace this with CurrencyMaturityDropdown */}
                                <HorizontalAssetSelector
                                    selectedAsset={selectedAsset}
                                    assetList={assetList}
                                    options={options}
                                    selected={selected}
                                    onAssetChange={onAssetChange}
                                    onTermChange={onTermChange}
                                />
                            </div>

                            <div
                                className={clsx(
                                    'col-span-2 pl-2 laptop:col-span-4 laptop:hidden',
                                    marketInfo && 'tablet:pl-0'
                                )}
                            >
                                <button
                                    onClick={() =>
                                        setIsMarketInfoDialogOpen(true)
                                    }
                                    className='flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-neutral-700 px-1 py-2'
                                >
                                    <DocumentTextIcon className='h-4 w-4 text-neutral-300' />
                                </button>
                            </div>
                        </section>

                        <div
                            className={clsx(
                                'hidden justify-around laptop:flex laptop:w-[75%] laptop:items-center laptop:p-4 desktop:gap-3.5'
                            )}
                        >
                            <div className='flex w-[20%] flex-col px-3 desktop:w-[15%]'>
                                <span className='typography-caption-2 text-neutral-400'>
                                    Mark Price (APR)
                                </span>
                                <span className='typography-desktop-body-3 font-semibold text-neutral-50'>
                                    {formatLoanValue(
                                        currentMarket?.value,
                                        'price'
                                    )}{' '}
                                    (
                                    {formatLoanValue(
                                        currentMarket?.value,
                                        'rate'
                                    )}
                                    )
                                </span>
                            </div>
                            <div className='flex w-[16%] flex-col px-3 desktop:w-[13%]'>
                                <MarketTab
                                    name='Last Price'
                                    value={`${formatLoanValue(
                                        lastLoanValue,
                                        'price'
                                    )} (${formatLoanValue(
                                        lastLoanValue,
                                        'rate'
                                    )})`}
                                />
                            </div>
                            <div className='flex w-auto flex-col px-3 desktop:w-[19%]'>
                                <MarketTab
                                    name='24H Price Change (APR)'
                                    value={<PriceRateChange />}
                                />
                            </div>
                            {marketInfo && (
                                <>
                                    <div className='hidden desktop:flex desktop:w-[11%]'>
                                        <MarketTab
                                            name='24h High (APR)'
                                            value={`${marketInfo.high} (${marketInfo.rateHigh})`}
                                        />
                                    </div>
                                    <div className='hidden desktop:flex desktop:w-[11%]'>
                                        <MarketTab
                                            name='24h Low (APR)'
                                            value={`${marketInfo.low} (${marketInfo.rateLow})`}
                                        />
                                    </div>
                                    <div className='w-[13%] px-3 desktop:w-[9%]'>
                                        <MarketTab
                                            name='24h Volume'
                                            value={marketInfo.volume}
                                        />
                                    </div>
                                </>
                            )}
                            <div
                                className={clsx('w-[13%] px-3 desktop:w-[8%]')}
                            >
                                <MarketTab
                                    name={`${selectedAsset?.value} Price`}
                                    value={currencyPrice || '0'}
                                    source={handleSource(selectedAsset?.value)}
                                />
                            </div>
                            <div className='flex flex-col px-3 laptop:w-[13%] desktop:w-[10%]'>
                                <MarketTab
                                    name='Countdown'
                                    value={formatRemainingTime(remainingTime)}
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
                priceSource={handleSource(selectedAsset?.value)}
                dailyStats={marketInfo}
                lastLoanValue={lastLoanValue}
            />
        </>
    );
};

const handleSource = (asset: CurrencySymbol | undefined) =>
    asset && COIN_GECKO_SOURCE.concat(currencyMap[asset].coinGeckoId);
