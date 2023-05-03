import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    GradientBox,
    MarketTab,
    Option,
    Separator as SeparatorAtom,
} from 'src/components/atoms';
import { HorizontalAssetSelector } from 'src/components/molecules/HorizontalAssetSelector';
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

const Separator = () => (
    <SeparatorAtom orientation='vertical' color='neutral-2' />
);

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
            setTermValue(v);
            onTermChange?.(v);
        },
        [onTermChange]
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
            <div className='flex min-w-full flex-row items-stretch justify-between gap-2 px-6 py-3'>
                <HorizontalAssetSelector
                    selectedAsset={selectedAsset}
                    assetList={assetList}
                    options={options}
                    selected={selected}
                    onAssetChange={handleAssetChange}
                    onTermChange={handleTermChange}
                />

                <MarketTab
                    name={Number(formatLoanValue(midLoanValue, 'price'))}
                    value={`${formatLoanValue(midLoanValue, 'rate')} APR`}
                />
                <Separator />
                <MarketTab name='24h High' value={getValue(values, 0)} />
                <Separator />
                <MarketTab name='24h Low' value={getValue(values, 1)} />
                <Separator />
                <MarketTab name='24h Trades' value={getValue(values, 2)} />
                <Separator />
                <MarketTab name='24h Volume' value={getValue(values, 3)} />
                <Separator />
                <MarketTab
                    name={`${selectedAsset?.value} Price`}
                    value={getValue(values, 4)}
                    source={handleSource(selectedAsset?.value)}
                />
            </div>
        </GradientBox>
    );
};

const handleSource = (asset: CurrencySymbol | undefined) =>
    asset && COIN_GECKO_SOURCE.concat(currencyMap[asset].coinGeckoId);
