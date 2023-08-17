import { BigNumber } from 'ethers';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DropdownSelector, InputBase, Option } from 'src/components/atoms';
import { prefixTilde } from 'src/utils';

type FormatFunction = (amount: number) => BigNumber;

export const AssetSelector = <AssetType extends string = string>({
    options,
    selected = options[0],
    priceList,
    amountFormatterMap,
    initialValue,
    onAssetChange,
    onAmountChange,
}: {
    options: Readonly<Array<Option<AssetType>>>;
    selected?: Option<AssetType>;
    priceList: Record<AssetType, number>;
    amountFormatterMap?: Record<AssetType, FormatFunction>;
    initialValue?: number;
    onAssetChange?: (v: AssetType) => void;
    onAmountChange?: (v: BigNumber) => void;
}) => {
    const [assetValue, setAssetValue] = useState(selected.value);
    const [amount, setAmount] = useState(initialValue);

    useEffect(() => {
        setAmount(initialValue);
    }, [initialValue]);

    const selectedOption = useMemo(
        () => options.find(o => o.value === assetValue),
        [options, assetValue]
    );

    const amountInUsd = useMemo(() => {
        if (!selectedOption?.value || !amount) {
            return '$0';
        }
        return new Intl.NumberFormat('en-us', {
            style: 'currency',
            currency: 'USD',
            currencySign: 'accounting',
            minimumFractionDigits: 0,
            maximumFractionDigits: 2,
        }).format(priceList[selectedOption.value] * amount);
    }, [selectedOption?.value, priceList, amount]);

    const handleInputChange = useCallback(
        (
            amount: number,
            assetValue: AssetType,
            onAmountChange: (v: BigNumber) => void
        ) => {
            let format = (x: number) => BigNumber.from(x);
            if (amountFormatterMap && amountFormatterMap[assetValue]) {
                format = amountFormatterMap[assetValue];
            }

            onAmountChange(format(amount));
        },
        [amountFormatterMap]
    );

    const handleAssetChange = useCallback(
        (v: AssetType) => {
            setAssetValue(v);
            if (onAssetChange) {
                onAssetChange(v);
            }
        },
        [onAssetChange]
    );

    const handleAmountChange = useCallback(
        (amount: number | undefined) => {
            setAmount(amount);
            if (onAmountChange && selectedOption) {
                handleInputChange(
                    amount ?? 0,
                    selectedOption.value,
                    onAmountChange
                );
            }
        },
        [handleInputChange, onAmountChange, selectedOption]
    );

    return (
        <div className='flex-col space-y-1'>
            <div className='typography-caption-2 mx-2 flex flex-row items-start justify-between'>
                <div className='text-secondary7'>Asset</div>
                <div className='text-white-60' data-testid='asset-selector-usd'>
                    {prefixTilde(amountInUsd)}
                </div>
            </div>
            <div className='flex h-14 flex-row items-center justify-between gap-1 rounded-lg bg-black-20 p-2 ring-inset ring-starBlue focus-within:ring-2'>
                <DropdownSelector
                    optionList={options}
                    selected={selected}
                    onChange={handleAssetChange}
                />
                <InputBase
                    className='typography-body-1 w-full text-right text-white'
                    onValueChange={handleAmountChange}
                    value={amount}
                    data-cy='asset-selector-input'
                    sizeDependentStyles={{
                        shortText: { maxChar: 8, styles: 'text-md' },
                        mediumText: { maxChar: 11, styles: 'text-[20px]' },
                        longText: { maxChar: Infinity, styles: 'text-sm' },
                    }}
                />
            </div>
        </div>
    );
};
