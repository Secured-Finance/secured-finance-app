import { useCallback, useMemo, useState } from 'react';
import { Option } from 'src/components/atoms';
import { CurrencyMaturityDropdown } from 'src/components/molecules';
import { MaturityOptionList } from 'src/types';
import { CurrencySymbol, getTransformMaturityOption } from 'src/utils';
import { Maturity } from 'src/utils/entities';

type HorizontalAssetSelectorProp = {
    selectedAsset: Option<CurrencySymbol> | undefined;
    assetList: Array<Option<CurrencySymbol>>;
    options: MaturityOptionList;
    selected: Option<Maturity>;
    onAssetChange: (v: CurrencySymbol) => void;
    onTermChange: (v: Maturity) => void;
};

export const HorizontalAssetSelector = ({
    selectedAsset,
    assetList,
    options,
    selected,
    onAssetChange,
    onTermChange,
}: HorizontalAssetSelectorProp) => {
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
                            getTransformMaturityOption(options)(
                                selectedTerm.label
                            )
                        }`}
                    </p>
                </div>
            </div>
            {/* <div className='hidden flex-col items-center'>
                <div className='flex w-full flex-col gap-1 laptop:max-w-[200px]'>
                    <DropdownSelector
                        optionList={options}
                        onChange={handleTermChange}
                        selected={selected}
                        variant='fullWidth'
                    />
                </div>
            </div> */}
        </div>
    );
};
