import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { GradientBox, MarketTab, Option } from 'src/components/atoms';
import { HorizontalAssetSelector } from 'src/components/molecules';
import { setCurrency } from 'src/store/landingOrderForm';
import { RootState } from 'src/store/types';
import { IndexOf } from 'src/types';
import {
    COIN_GECKO_SOURCE,
    CurrencySymbol,
    currencyMap,
    formatLoanValue,
} from 'src/utils';
import { LoanValue, Maturity } from 'src/utils/entities';

type ValueField = number | string;
type AdvancedLendingTopBarProp<T> = {
    selectedAsset: Option<CurrencySymbol> | undefined;
    assetList: Array<Option<CurrencySymbol>>;
    options: Array<Option<T>>;
    selected: Option<T>;
    onAssetChange?: (v: CurrencySymbol) => void;
    onTermChange?: (v: T) => void;
    values?: [ValueField, ValueField, ValueField, ValueField, ValueField];
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
    values,
}: AdvancedLendingTopBarProp<T>) => {
    const [termValue, setTermValue] = useState(selected.value);
    const midPrice = useSelector(
        (state: RootState) => state.analytics.midPrice
    );

    const handleTermChange = useCallback(
        (v: T) => {
            if (v === termValue) return;
            setTermValue(v);
            onTermChange?.(v);
        },
        [onTermChange, termValue]
    );

    const handleAssetChange = useCallback(
        (v: CurrencySymbol) => {
            setCurrency(v);
            onAssetChange?.(v);
        },
        [onAssetChange]
    );

    const midLoanValue = LoanValue.fromPrice(
        midPrice,
        new Maturity(termValue).toNumber()
    );

    return (
        <GradientBox shape='rectangle'>
            <div className='grid-col-3 tablet:grid-col-6 grid gap-y-6 px-5 pb-3 pt-6 laptop:grid-flow-col laptop:place-content-around laptop:items-start laptop:pt-4'>
                <div className='col-span-3 pr-5'>
                    <HorizontalAssetSelector
                        selectedAsset={selectedAsset}
                        assetList={assetList}
                        options={options}
                        selected={selected}
                        onAssetChange={handleAssetChange}
                        onTermChange={handleTermChange}
                    />
                </div>
                <div className='col-span-3 col-start-1 tablet:col-span-2 laptop:col-span-2 laptop:border-r laptop:border-white-10 laptop:pr-5'>
                    <MarketTab
                        name={Number(formatLoanValue(midLoanValue, 'price'))}
                        value={`${formatLoanValue(midLoanValue, 'rate')} APR`}
                    />
                </div>
                <div className='border-r border-white-10 pr-5 tablet:col-start-4 tablet:row-start-1 laptop:col-start-auto laptop:row-start-auto laptop:px-5'>
                    <MarketTab name='24h High' value={getValue(values, 0)} />
                </div>
                <div className='border-r border-white-10 px-5 tablet:col-start-5 tablet:row-start-1 laptop:col-start-auto laptop:row-start-auto'>
                    <MarketTab name='24h Low' value={getValue(values, 1)} />
                </div>
                <div className='px-5 tablet:col-start-6 tablet:row-start-1 laptop:col-start-auto laptop:row-start-auto laptop:border-r laptop:border-white-10'>
                    <MarketTab name='24h Trades' value={getValue(values, 2)} />
                </div>
                <div className='border-r border-white-10 pr-5 tablet:col-start-4 tablet:row-start-2 laptop:col-start-auto laptop:row-start-auto laptop:px-5'>
                    <MarketTab name='24h Volume' value={getValue(values, 3)} />
                </div>
                <div className='border-white-10 px-5 tablet:col-start-5 tablet:row-start-2 laptop:col-start-auto laptop:row-start-auto'>
                    <MarketTab
                        name={`${selectedAsset?.value} Price`}
                        value={getValue(values, 4)}
                        source={handleSource(selectedAsset?.value)}
                    />
                </div>
            </div>
        </GradientBox>
    );
};

const handleSource = (asset: CurrencySymbol | undefined) =>
    asset && COIN_GECKO_SOURCE.concat(currencyMap[asset].coinGeckoId);
