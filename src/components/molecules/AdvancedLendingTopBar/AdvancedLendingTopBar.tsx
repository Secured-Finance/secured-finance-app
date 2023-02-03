import { useCallback, useMemo, useState } from 'react';
import {
    DropdownSelector,
    GradientBox,
    MarketTab,
    Option,
    Separator,
} from 'src/components/atoms';
import { setCurrency } from 'src/store/landingOrderForm';
import { currencyMap, CurrencySymbol } from 'src/utils';

const getValue = (values: number[] | undefined, index: number) => {
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
}: {
    selectedAsset: Option<CurrencySymbol> | undefined;
    assetList: Array<Option<CurrencySymbol>>;
    options: Array<Option<T>>;
    selected: Option<T>;
    transformLabel?: (v: string) => string;
    onAssetChange?: (v: CurrencySymbol) => void;
    onTermChange?: (v: T) => void;
    values?: number[];
}) => {
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

    return (
        <div className='h-fit w-full'>
            <GradientBox shape='rectangle'>
                <div className='flex flex-row'>
                    <div className='typography-caption-2 grid w-[350px] grid-cols-2 flex-col gap-1 px-6 pt-5 pb-7 text-neutral-4'>
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
                    <Separator
                        orientation='vertical'
                        color='white-10'
                    ></Separator>
                    <div className='flex flex-grow flex-row gap-6 pt-6 pb-8 pl-10'>
                        <MarketTab name={0.7977} value={'25.00% APY'} />
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
                    </div>
                </div>
            </GradientBox>
        </div>
    );
};
