import { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    DropdownSelector,
    GradientBox,
    MarketTab,
    Option,
    Separator as SeparatorAtom,
} from 'src/components/atoms';
import { setCurrency } from 'src/store/landingOrderForm';
import { RootState } from 'src/store/types';
import { IndexOf } from 'src/types';
import { currencyMap, CurrencySymbol, formatLoanValue } from 'src/utils';
import { LoanValue, Maturity } from 'src/utils/entities';

type ValueField = number | string;
type AdvancedLendingTopBarProp<T> = {
    selectedAsset: Option<CurrencySymbol> | undefined;
    assetList: Array<Option<CurrencySymbol>>;
    options: Array<Option<T>>;
    selected: Option<T>;
    transformLabel?: (v: string) => string;
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
    transformLabel = (v: string) => v,
    onAssetChange,
    onTermChange,
    values,
}: AdvancedLendingTopBarProp<T>) => {
    const [termValue, setTermValue] = useState(selected.value);
    const midPrice = useSelector(
        (state: RootState) => state.analytics.midPrice
    );
    const selectedTerm = useMemo(
        () => options.find(o => o.value === termValue),
        [options, termValue]
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
        <div className='h-fit'>
            <GradientBox shape='rectangle'>
                <div className='flex flex-row items-stretch justify-start gap-10 px-6 py-3'>
                    <div className='typography-caption-2 grid min-w-fit grid-cols-2 gap-x-5 gap-y-1 text-neutral-4'>
                        <DropdownSelector
                            optionList={assetList}
                            selected={selectedAsset}
                            onChange={handleAssetChange}
                        />
                        <DropdownSelector
                            optionList={options}
                            onChange={handleTermChange}
                            selected={selected}
                        />
                        <div>
                            {selectedAsset
                                ? currencyMap[selectedAsset.value].name
                                : undefined}
                        </div>
                        <div className='whitespace-nowrap'>
                            {`Maturity ${
                                selectedTerm &&
                                transformLabel(selectedTerm.label)
                            }`}
                        </div>
                    </div>
                    <MarketTab
                        name={Number(formatLoanValue(midLoanValue, 'price'))}
                        value={`${formatLoanValue(midLoanValue, 'rate')} APY`}
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
                    />
                </div>
            </GradientBox>
        </div>
    );
};
