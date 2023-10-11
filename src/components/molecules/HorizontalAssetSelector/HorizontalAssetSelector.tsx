import { useCallback, useMemo, useState } from 'react';
import { DropdownSelector, Option } from 'src/components/atoms';
import {
    CurrencySymbol,
    currencyMap,
    getTransformMaturityOption,
} from 'src/utils';
type HorizontalAssetSelectorProp<T> = {
    selectedAsset: Option<CurrencySymbol> | undefined;
    assetList: Array<Option<CurrencySymbol>>;
    options: Array<Option<T>>;
    selected: Option<T>;
    onAssetChange: (v: CurrencySymbol) => void;
    onTermChange: (v: T) => void;
};

export const HorizontalAssetSelector = <T extends string = string>({
    selectedAsset,
    assetList,
    options,
    selected,
    onAssetChange,
    onTermChange,
}: HorizontalAssetSelectorProp<T>) => {
    const [termValue, setTermValue] = useState(selected.value);

    const selectedTerm = useMemo(
        () => options.find(o => o.value === termValue),
        [options, termValue]
    );

    const handleTermChange = useCallback(
        (v: T) => {
            setTermValue(v);
            onTermChange(v);
        },
        [onTermChange]
    );

    return (
        <div className='typography-caption-2 grid min-w-fit grid-cols-2 gap-x-5 gap-y-1 text-neutral-4'>
            <DropdownSelector
                optionList={assetList}
                selected={selectedAsset}
                onChange={onAssetChange}
                variant='fixedWidth'
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
                    getTransformMaturityOption(options)(selectedTerm.label)
                }`}
            </div>
        </div>
    );
};
