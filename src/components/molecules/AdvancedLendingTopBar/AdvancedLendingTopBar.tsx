import clsx from 'clsx';
import { useCallback, useMemo, useState } from 'react';
import { MarketTab, Option } from 'src/components/atoms';
import { CurrencyMaturityDropdown } from 'src/components/molecules';
import { IndexOf } from 'src/types';
import {
    COIN_GECKO_SOURCE,
    CurrencySymbol,
    currencyMap,
    getTransformMaturityOption,
} from 'src/utils';
import { Maturity } from 'src/utils/entities';

type AdvancedLendingTopBarProp = {
    selectedAsset: Option<CurrencySymbol> | undefined;
    assetList: Array<Option<CurrencySymbol>>;
    options: Array<Option<Maturity>>;
    selected: Option<Maturity>;
    onAssetChange: (v: CurrencySymbol) => void;
    onTermChange: (v: Maturity) => void;
    currencyPrice: string;
    values?: [string, string, string, string];
};

const getValue = (
    values: AdvancedLendingTopBarProp['values'],
    index: IndexOf<NonNullable<AdvancedLendingTopBarProp['values']>>
) => {
    return values && values[index] ? values[index] : 0;
};

export const AdvancedLendingTopBar = ({
    selectedAsset,
    assetList,
    options,
    selected,
    onAssetChange,
    onTermChange,
    currencyPrice,
    values,
}: AdvancedLendingTopBarProp) => {
    const [termValue, setTermValue] = useState(selected.value);
    const selectedTerm = useMemo(
        () => options.find(o => o.value === termValue),
        [options, termValue]
    );

    const handleTermChange = useCallback(
        (v: Maturity) => {
            setTermValue(v);
            onTermChange(v);
        },
        [onTermChange]
    );

    const onChange = (asset: CurrencySymbol, maturity: Maturity) => {
        handleTermChange(maturity);
        onAssetChange(asset);
    };
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
                            <div className='grid grid-cols-1 gap-x-3 gap-y-1 text-neutral-4 desktop:gap-x-5'>
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
                        </div>
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
