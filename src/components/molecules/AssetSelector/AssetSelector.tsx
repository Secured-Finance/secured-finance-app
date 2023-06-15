import { BigNumber } from 'ethers';
import { useCallback, useMemo, useState } from 'react';
import { DropdownSelector, InputBase, Option } from 'src/components/atoms';

type FormatFunction = (amount: number) => BigNumber;

export const AssetSelector = <AssetType extends string = string>({
    options,
    selected = options[0],
    priceList,
    transformLabel = (v: string) => v,
    amountFormatterMap,
    onAssetChange,
    onAmountChange,
}: {
    options: Readonly<Array<Option<AssetType>>>;
    selected?: Option<AssetType>;
    priceList: Record<AssetType, number>;
    amountFormatterMap?: Record<AssetType, FormatFunction>;
    transformLabel?: (v: string) => string;
    onAssetChange?: (v: AssetType) => void;
    onAmountChange?: (v: BigNumber) => void;
}) => {
    const [assetValue, setAssetValue] = useState(selected.value);
    const [amount, setAmount] = useState<number | undefined>();

    const selectedOption = useMemo(
        () => options.find(o => o.value === assetValue),
        [options, assetValue]
    );

    const amountInUsd = useMemo(() => {
        if (!selectedOption?.value) {
            return 0;
        }
        return new Intl.NumberFormat('en-us', {
            minimumFractionDigits: 0,
        }).format(priceList[selectedOption.value] * (amount ?? 0));
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
            if (onAmountChange) {
                handleInputChange(amount ?? 0, v, onAmountChange);
            }
        },
        [onAssetChange, onAmountChange, handleInputChange, amount]
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
        <div className='w-72 flex-col items-start justify-start space-y-2'>
            <div className='typography-caption-2 flex flex-row items-start justify-between'>
                <div className='ml-2 text-planetaryPurple'>Asset</div>
                <div
                    className='mr-1 text-white-60'
                    data-testid='asset-selector-usd'
                >
                    {`~ ${amountInUsd} USD`}
                </div>
            </div>
            <div className='flex h-14 flex-row items-center justify-between space-x-2 rounded-lg bg-black-20 py-2 pl-2 pr-4 ring-starBlue focus-within:ring'>
                <DropdownSelector
                    optionList={options}
                    selected={selected}
                    onChange={handleAssetChange}
                />
                <InputBase
                    className='typography-body-1-bold h-8 w-20 rounded-lg text-right text-white'
                    onValueChange={handleAmountChange}
                    value={amount}
                    data-cy='asset-selector-input'
                />

                <div
                    className='typography-caption ml-2 flex text-white-60'
                    data-testid='asset-selector-transformed-value'
                >
                    {selectedOption && transformLabel(selectedOption.label)}
                </div>
            </div>
        </div>
    );
};
