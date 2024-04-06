import { useCallback, useMemo, useState } from 'react';
import { DropdownSelector, Option } from 'src/components/atoms';
import { CurrencyDropdown } from 'src/components/molecules';
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
        <div className='grid grid-cols-2 gap-x-3 gap-y-1 text-neutral-4 desktop:gap-x-5'>
            <div className='flex flex-col items-center'>
                <div className='flex w-full flex-col gap-1 laptop:max-w-[200px]'>
                    <CurrencyDropdown
                        currencyOptionList={assetList}
                        selected={selectedAsset}
                        onChange={onAssetChange}
                    />
                    <p className='text-[11px] leading-4 tablet:text-xs laptop:text-xs'>
                        {selectedAsset
                            ? currencyMap[selectedAsset.value].name
                            : undefined}
                    </p>
                </div>
            </div>
            <div className='flex flex-col items-center'>
                <div className='flex w-full flex-col gap-1 laptop:max-w-[200px]'>
                    <DropdownSelector
                        optionList={options}
                        onChange={handleTermChange}
                        selected={selected}
                        variant='fullWidth'
                    />
                    <p className='whitespace-nowrap text-[11px] leading-4 tablet:text-xs laptop:text-xs'>
                        {`Maturity ${
                            selectedTerm &&
                            getTransformMaturityOption(options)(
                                selectedTerm.label
                            )
                        }`}
                    </p>
                </div>
            </div>
        </div>
    );
};
