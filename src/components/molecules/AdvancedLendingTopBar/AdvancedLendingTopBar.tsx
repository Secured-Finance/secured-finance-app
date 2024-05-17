import clsx from 'clsx';
import { MarketTab, Option } from 'src/components/atoms';
import { HorizontalAssetSelector } from 'src/components/molecules';
import { IndexOf } from 'src/types';
import { COIN_GECKO_SOURCE, CurrencySymbol, currencyMap } from 'src/utils';
import { LoanValue } from 'src/utils/entities';

type AdvancedLendingTopBarProp<T> = {
    selectedAsset: Option<CurrencySymbol> | undefined;
    assetList: Array<Option<CurrencySymbol>>;
    options: Array<Option<T>>;
    selected: Option<T>;
    onAssetChange: (v: CurrencySymbol) => void;
    onTermChange: (v: T) => void;
    currentMarket: CurrentMarket | undefined;
    currencyPrice: string;
    values?: [string, string, string, string];
};

type CurrentMarket = {
    value: LoanValue;
    time: number;
    type: 'opening' | 'block';
};

const getValue = (
    values: AdvancedLendingTopBarProp<unknown>['values'],
    index: IndexOf<NonNullable<AdvancedLendingTopBarProp<unknown>['values']>>
) => {
    return values && values[index] ? values[index] : 0;
};

// TODO: remove getTime and MarketTab properly
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
    // const getTime = () => {
    //     if (currentMarket) {
    //         if (currentMarket.type === 'opening') {
    //             return 'Opening Price';
    //         } else {
    //             return formatTimeStampWithTimezone(currentMarket.time);
    //         }
    //     }
    //     return '-';
    // };

    return (
        <div>
            <div className='h-1 bg-starBlue'></div>
            <div className='border-white-10 laptop:border-x laptop:border-b laptop:bg-black-20'>
                <div
                    className={clsx(
                        'grid grid-cols-12 gap-y-3 px-4 pb-[1.1875rem] pt-4 laptop:flex laptop:pb-3 laptop:pt-4',
                        values && 'tablet:px-5'
                    )}
                >
                    <section
                        className={clsx(
                            'col-span-12 grid grid-cols-12 gap-3 laptop:w-[43%] laptop:gap-y-0',
                            values && 'tablet:col-span-6 tablet:gap-y-6'
                        )}
                    >
                        <div
                            className={clsx(
                                'col-span-7 pr-[11px] laptop:col-span-8 laptop:pr-0',
                                values && 'tablet:col-span-12 tablet:pr-9'
                            )}
                        >
                            <HorizontalAssetSelector
                                selectedAsset={selectedAsset}
                                assetList={assetList}
                                options={options}
                                selected={selected}
                                onAssetChange={onAssetChange}
                                onTermChange={onTermChange}
                            />
                        </div>
                        {/* <div
                            className={clsx(
                                'col-span-5 pl-2 laptop:border-r laptop:border-white-10 laptop:px-2',
                                values && 'tablet:pl-0'
                            )}
                        >
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
                                    currentMarket ? 'green-name' : 'gray-name'
                                }
                                label='Current Market'
                            />
                            <div className='laptop:typography-caption-2 whitespace-nowrap pt-[1px] text-[11px] leading-4 text-neutral-4'>
                                {getTime()}
                            </div>
                        </div> */}
                    </section>

                    <div
                        className={clsx(
                            'col-span-12 grid grid-cols-12 gap-3 gap-y-3  laptop:w-[57%] laptop:grid-cols-10 laptop:items-start laptop:pl-4',
                            values && 'tablet:col-span-6 tablet:gap-y-6'
                        )}
                    >
                        {values && (
                            <>
                                <div className='col-span-4 border-white-10 tablet:col-span-4 tablet:border-r laptop:col-span-2'>
                                    <MarketTab
                                        name='24h High'
                                        value={getValue(values, 0)}
                                    />
                                </div>
                                <div className='col-span-4 border-white-10 tablet:col-span-4 tablet:border-r tablet:px-5 laptop:col-span-2 laptop:px-0'>
                                    <MarketTab
                                        name='24h Low'
                                        value={getValue(values, 1)}
                                    />
                                </div>
                                <div className='col-span-4 pl-2 tablet:col-span-4 tablet:px-5 laptop:col-span-2 laptop:border-r laptop:border-white-10 laptop:px-0'>
                                    <MarketTab
                                        name='24h Trades'
                                        value={getValue(values, 2)}
                                    />
                                </div>
                                <div className='col-span-4 border-white-10 tablet:border-r tablet:pr-5 laptop:col-span-2 laptop:pr-0'>
                                    <MarketTab
                                        name='24h Volume'
                                        value={getValue(values, 3)}
                                    />
                                </div>
                            </>
                        )}
                        <div
                            className={clsx(
                                'col-span-4 laptop:col-span-2 laptop:px-0',
                                values && 'tablet:px-5'
                            )}
                        >
                            <MarketTab
                                name={`${selectedAsset?.value} Price`}
                                value={currencyPrice || '0'}
                                source={handleSource(selectedAsset?.value)}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

const handleSource = (asset: CurrencySymbol | undefined) =>
    asset && COIN_GECKO_SOURCE.concat(currencyMap[asset].coinGeckoId);
