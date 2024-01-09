import { useCallback, useEffect, useMemo, useState } from 'react';
import { InputBase } from 'src/components/atoms';
import { CurrencyDropdown, CurrencyOption } from 'src/components/molecules';
import { CurrencySymbol, prefixTilde } from 'src/utils';

export const AssetSelector = ({
    options,
    selected = options[0],
    priceList,
    initialValue,
    onAssetChange,
    onAmountChange,
}: {
    options: Readonly<Array<CurrencyOption>>;
    selected?: CurrencyOption;
    priceList: Record<CurrencySymbol, number>;
    initialValue?: string;
    onAssetChange?: (v: CurrencySymbol) => void;
    onAmountChange?: (v: string) => void;
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
        }).format(priceList[selectedOption.value] * Number(amount));
    }, [selectedOption?.value, priceList, amount]);

    const handleAssetChange = useCallback(
        (v: CurrencySymbol) => {
            setAssetValue(v);
            if (onAssetChange) {
                onAssetChange(v);
            }
        },
        [onAssetChange]
    );

    const handleAmountChange = useCallback(
        (amount: string | undefined) => {
            setAmount(amount);
            if (onAmountChange && selectedOption) {
                onAmountChange(amount ?? '');
            }
        },
        [onAmountChange, selectedOption]
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
                <CurrencyDropdown
                    currencyOptionList={options}
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
