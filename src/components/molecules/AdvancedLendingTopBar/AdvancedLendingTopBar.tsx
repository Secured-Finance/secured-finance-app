import { GradientBox, MarketTab, Option } from 'src/components/atoms';
import { HorizontalAssetSelector } from 'src/components/molecules';
import { IndexOf } from 'src/types';
import {
    COIN_GECKO_SOURCE,
    CurrencySymbol,
    currencyMap,
    formatLoanValue,
    formatTimestampWithMonth,
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
            }

            if (currentMarket.type === 'block' && currentMarket.time) {
                return formatTimestampWithMonth(currentMarket.time);
            }

            // TODO: replace this '-' with the block time
            return '-';
        }
        return '-';
    };

    return (
        <GradientBox shape='rectangle'>
            <div className='grid grid-cols-12 gap-y-3 px-4 py-5 tablet:px-5 laptop:pt-4'>
                <section className='col-span-12 grid grid-cols-12 gap-3 tablet:col-span-6 tablet:gap-y-6 laptop:col-span-5 laptop:gap-y-0'>
                    <div className='col-span-8 tablet:col-span-12 tablet:pr-9 laptop:col-span-9 laptop:pr-4'>
                        <HorizontalAssetSelector
                            selectedAsset={selectedAsset}
                            assetList={assetList}
                            options={options}
                            selected={selected}
                            onAssetChange={onAssetChange}
                            onTermChange={onTermChange}
                        />
                    </div>
                    <div className='col-span-4 pl-4 tablet:pl-0 laptop:col-span-3 laptop:border-r laptop:border-white-10 laptop:pr-5'>
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
                        <div className='typography-caption-2 whitespace-nowrap text-neutral-4'>
                            {getTime()}
                        </div>
                    </div>
                </section>

                {/* content broken into 2 lines */}
                <div className='col-span-12 grid grid-cols-12 gap-3 gap-y-3 tablet:col-span-6 tablet:gap-y-6 laptop:col-span-7 laptop:items-start'>
                    <div className='col-span-4 border-white-10 tablet:col-span-4 tablet:border-r laptop:col-span-2 laptop:px-5'>
                        <MarketTab
                            name='24h High'
                            value={getValue(values, 0)}
                        />
                    </div>
                    <div className='col-span-4 border-white-10 tablet:col-span-4 tablet:border-r tablet:px-5 laptop:col-span-2'>
                        <MarketTab name='24h Low' value={getValue(values, 1)} />
                    </div>
                    <div className='col-span-4 tablet:col-span-4 tablet:px-5 laptop:col-span-3 laptop:border-r laptop:border-white-10'>
                        <MarketTab
                            name='24h Trades'
                            value={getValue(values, 2)}
                        />
                    </div>
                    <div className='col-span-4 border-white-10 tablet:border-r tablet:pr-5 laptop:col-span-3 laptop:px-5'>
                        <MarketTab
                            name='24h Volume'
                            value={getValue(values, 3)}
                        />
                    </div>
                    <div className='col-span-4 tablet:px-5 laptop:col-span-2'>
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
