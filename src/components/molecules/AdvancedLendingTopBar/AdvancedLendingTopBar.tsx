import { useCallback, useMemo, useState } from 'react';
import {
    DropdownSelector,
    GradientBox,
    MarketTab,
    Option,
    Separator,
} from 'src/components/atoms';
import { setCurrency } from 'src/store/landingOrderForm';
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
        9800,
        new Maturity(termValue).toNumber()
    );

    return (
        <div className='h-fit w-full'>
            <GradientBox shape='rectangle'>
                <div className='flex flex-row pb-3'>
                    <div className='typography-caption-2 grid w-[350px] grid-cols-2 flex-col gap-1 px-6 pt-5 text-neutral-4'>
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
                        <div className='text-left'>
                            {`Maturity ${
                                selectedTerm &&
                                transformLabel(selectedTerm.label)
                            }`}
                        </div>
                    </div>
                    <div className='flex flex-grow flex-row gap-6 pt-6 pl-10'>
                        <MarketTab
                            name={Number(
                                formatLoanValue(midLoanValue, 'price')
                            )}
                            value={`${formatLoanValue(
                                midLoanValue,
                                'rate'
                            )} APY`}
                        />
                        <Separator orientation='vertical' color='neutral-2' />
                        <MarketTab
                            name='24h High'
                            value={getValue(values, 0)}
                        />
                        <Separator orientation='vertical' color='neutral-2' />
                        <MarketTab name='24h Low' value={getValue(values, 1)} />
                        <Separator orientation='vertical' color='neutral-2' />
                        <MarketTab
                            name='24h Trades'
                            value={getValue(values, 2)}
                        />
                        <Separator orientation='vertical' color='neutral-2' />
                        <MarketTab
                            name='24h Volume'
                            value={getValue(values, 3)}
                        />
                        <Separator orientation='vertical' color='neutral-2' />
                        <MarketTab
                            name={`${selectedAsset?.value} Price`}
                            value={getValue(values, 4)}
                        />
                    </div>
                </div>
            </GradientBox>
        </div>
    );
};
