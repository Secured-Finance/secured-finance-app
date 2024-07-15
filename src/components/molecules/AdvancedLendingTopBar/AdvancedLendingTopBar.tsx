import clsx from 'clsx';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import { useEffect, useState } from 'react';
import DocumentTextIcon from 'src/assets/icons/document-text.svg';
import { MarketTab, Option } from 'src/components/atoms';
import { HorizontalAssetSelector } from 'src/components/molecules';
import { MarketInfoDialog } from 'src/components/organisms';
import { CurrentMarket, IndexOf } from 'src/types';
import {
    COIN_GECKO_SOURCE,
    CurrencySymbol,
    currencyMap,
    formatLoanValue,
    formatRemainingTime,
    formatTimeStampWithTimezone,
} from 'src/utils';

dayjs.extend(duration);

type AdvancedLendingTopBarProp<T> = {
    selectedAsset: Option<CurrencySymbol> | undefined;
    assetList: Array<Option<CurrencySymbol>>;
    options: Array<Option<T>>;
    selected: Option<T>;
    onAssetChange: (v: CurrencySymbol) => void;
    onTermChange: (v: T) => void;
    currentMarket: CurrentMarket | undefined;
    currencyPrice: string;
    values?: [
        string,
        string,
        string,
        string,
        string,
        string,
        boolean | undefined
    ];
};

const getValue = (
    values: AdvancedLendingTopBarProp<unknown>['values'],
    index: IndexOf<NonNullable<AdvancedLendingTopBarProp<unknown>['values']>>
) => {
    return values && values[index] ? values[index] : 0;
};

export const AdvancedLendingTopBar = <T extends string = string>({
    selectedAsset,
    assetList,
    options,
    selected,
    onAssetChange,
    onTermChange,
    currentMarket,
    currencyPrice,
    values,
}: AdvancedLendingTopBarProp<T>) => {
    const maturity = currentMarket?.value.maturity ?? 0;

    const [isMarketInfoDialogOpen, setIsMarketInfoDialogOpen] =
        useState<boolean>(false);
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

    const dailyStats: Record<string, string | number | boolean | undefined> = {
        high: getValue(values, 0),
        low: getValue(values, 1),
        volume: getValue(values, 3),
        isIncreased: getValue(values, 6),
    };

    const [remainingTime, setRemainingTime] = useState<number>(
        maturity - dayjs().unix()
    );

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

    const priceHigh = getValue(values, 0);
    const priceLow = getValue(values, 1);

    const getPercentagePriceChange = () => {
        if (dailyStats.isIncreased === undefined || !priceHigh || !priceLow) {
            return '-';
        }

        const high = parseFloat(priceHigh as string);
        const low = parseFloat(priceLow as string);

        let percentageChange = 0;
        if (dailyStats.isIncreased) {
            if (low === 0) {
                return '-';
            }
            percentageChange = ((high - low) / low) * 100;

            return `+${percentageChange.toFixed(2)}%`;
        } else {
            if (high === 0) {
                return '-';
            }
            percentageChange = ((low - high) / high) * 100;
            return `-${percentageChange.toFixed(2)}%`;
        }
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
                        <section
                            className={clsx(
                                'col-span-12 grid grid-cols-12 gap-3 border-neutral-600 laptop:w-[25%] laptop:gap-y-0 laptop:border-r laptop:px-6 laptop:py-4',
                                values && 'tablet:gap-y-6'
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
                                    values && 'tablet:pl-0'
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
                                {/* TODO: remove this chunk. using hidden to hide it during dev */}
                                <div className='hidden'>
                                    <MarketTab
                                        name={formatLoanValue(
                                            currentMarket?.value,
                                            'price'
                                        )}
                                        value={`${formatLoanValue(
                                            currentMarket?.value,
                                            'rate'
                                        )} APR`}
                                        variant={
                                            currentMarket
                                                ? 'green-name'
                                                : 'gray-name'
                                        }
                                        label='Current Market'
                                    />
                                    <div className='laptop:typography-caption-2 whitespace-nowrap pt-[1px] text-[11px] leading-4 text-neutral-4'>
                                        {getTime()}
                                    </div>
                                </div>
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
                                    value={'96.89 (5.25%)'}
                                />
                            </div>
                            <div className='flex w-auto flex-col px-3 desktop:w-[19%]'>
                                {/* TODO: address APR change */}
                                <MarketTab
                                    name='24H Price Change (APR)'
                                    value={`${getPercentagePriceChange()} (???% APR)`}
                                />
                            </div>
                            {values && (
                                <>
                                    <div className='hidden desktop:flex desktop:w-[11%]'>
                                        <MarketTab
                                            name='24h High (APR)'
                                            value={`${getValue(
                                                values,
                                                0
                                            )} (${getValue(values, 4)})`}
                                        />
                                    </div>
                                    <div className='hidden desktop:flex desktop:w-[11%]'>
                                        <MarketTab
                                            name='24h Low (APR)'
                                            value={`${getValue(
                                                values,
                                                1
                                            )} (${getValue(values, 5)})`}
                                        />
                                    </div>
                                    <div className='w-[13%] px-3 desktop:w-[9%]'>
                                        <MarketTab
                                            name='24h Volume'
                                            value={getValue(values, 3)}
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
                dailyStats={dailyStats}
            />
        </>
    );
};

const handleSource = (asset: CurrencySymbol | undefined) =>
    asset && COIN_GECKO_SOURCE.concat(currencyMap[asset].coinGeckoId);
