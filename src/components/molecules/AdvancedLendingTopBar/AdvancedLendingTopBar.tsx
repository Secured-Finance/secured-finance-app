import { GradientBox, MarketTab, Option } from 'src/components/atoms';
import { HorizontalAssetSelector } from 'src/components/molecules';
import { IndexOf } from 'src/types';
import {
    COIN_GECKO_SOURCE,
    CurrencySymbol,
    currencyMap,
    formatLoanValue,
    formatTimeStampWithTimezone,
} from 'src/utils';
import { LoanValue } from 'src/utils/entities';

type ValueField = number | string;
type AdvancedLendingTopBarProp<T> = {
    selectedAsset: Option<CurrencySymbol> | undefined;
    assetList: Array<Option<CurrencySymbol>>;
    options: Array<Option<T>>;
    selected: Option<T>;
    onAssetChange: (v: CurrencySymbol) => void;
    onTermChange: (v: T) => void;
    currentMarket: CurrentMarket | undefined;
    values?: [ValueField, ValueField, ValueField, ValueField, ValueField];
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

export const AdvancedLendingTopBar = <T extends string = string>({
    selectedAsset,
    assetList,
    options,
    selected,
    onAssetChange,
    onTermChange,
    currentMarket,
    values,
}: AdvancedLendingTopBarProp<T>) => {
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

    return (
        <GradientBox shape='rectangle'>
            <div className='grid grid-cols-12 gap-y-3 px-4 pb-[1.1875rem] pt-4 tablet:px-5 laptop:flex laptop:pt-4 '>
                <section className='col-span-12 grid grid-cols-12 gap-3 tablet:col-span-6 tablet:gap-y-6 laptop:w-[43%] laptop:gap-y-0'>
                    <div className='col-span-8 tablet:col-span-12 tablet:pr-9 laptop:col-span-8 laptop:pr-0'>
                        <HorizontalAssetSelector
                            selectedAsset={selectedAsset}
                            assetList={assetList}
                            options={options}
                            selected={selected}
                            onAssetChange={onAssetChange}
                            onTermChange={onTermChange}
                        />
                    </div>
                    <div className='col-span-4 pl-2 tablet:pl-0 laptop:border-r laptop:border-white-10 laptop:px-2'>
                        <MarketTab
                            name={formatLoanValue(
                                currentMarket?.value,
                                'price'
                            )}
                            value={`${formatLoanValue(
                                currentMarket?.value,
                                'rate'
                            )} APR`}
                            variant={currentMarket ? 'green-name' : 'gray-name'}
                            label='Current Market'
                        />
                        <div className='whitespace-nowrap pt-[1px] text-[11px] leading-4 text-neutral-4'>
                            {getTime()}
                        </div>
                    </div>
                </section>

                <div className='col-span-12 grid grid-cols-12 gap-3 gap-y-3 tablet:col-span-6 tablet:gap-y-6 laptop:w-[57%] laptop:grid-cols-10 laptop:items-start laptop:pl-4'>
                    <div className='col-span-4 border-white-10 tablet:col-span-4 tablet:border-r laptop:col-span-2'>
                        <MarketTab
                            name='24h High'
                            value={getValue(values, 0)}
                        />
                    </div>
                    <div className='col-span-4 border-white-10 tablet:col-span-4 tablet:border-r tablet:px-5 laptop:col-span-2 laptop:px-0'>
                        <MarketTab name='24h Low' value={getValue(values, 1)} />
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
                    <div className='col-span-4 tablet:px-5 laptop:col-span-2 laptop:px-0'>
                        <MarketTab
                            name={`${selectedAsset?.value} Price`}
                            value={getValue(values, 4)}
                            source={handleSource(selectedAsset?.value)}
                        />
                    </div>
                </div>
            </div>
        </GradientBox>
    );
};

const handleSource = (asset: CurrencySymbol | undefined) =>
    asset && COIN_GECKO_SOURCE.concat(currencyMap[asset].coinGeckoId);
