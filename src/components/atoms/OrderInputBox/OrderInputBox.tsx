import { BigNumber } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { InformationPopover, InputBase } from 'src/components/atoms';
import { amountFormatterToBase, CurrencySymbol } from 'src/utils';

interface OrderInputBoxProps {
    field: string;
    unit?: string;
    initialValue?: number | string;
    asset?: CurrencySymbol;
    disabled?: boolean;
    informationText?: string;
    decimalPlacesAllowed?: number;
    maxLimit?: number;
    onValueChange?: (v: number | BigNumber) => void;
}

export const OrderInputBox = ({
    field,
    unit,
    initialValue = 0,
    asset,
    disabled = false,
    informationText,
    decimalPlacesAllowed,
    maxLimit,
    onValueChange,
}: OrderInputBoxProps) => {
    const [inputValue, setInputValue] = useState(initialValue);

    useEffect(() => {
        if (inputValue !== '' || initialValue !== 0)
            setInputValue(initialValue);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialValue]);

    const handleInputChange = useCallback(
        (
            amount: number,
            asset: CurrencySymbol | undefined,
            onValueChange: (v: number | BigNumber) => void
        ) => {
            let format = (x: number) => BigNumber.from(x);
            if (
                asset &&
                amountFormatterToBase &&
                amountFormatterToBase[asset]
            ) {
                format = amountFormatterToBase[asset];
            }
            asset ? onValueChange(format(amount)) : onValueChange(amount);
        },
        []
    );

    const handleAmountChange = useCallback(
        (amount: number | undefined) => {
            amount ? setInputValue(amount) : setInputValue('');
            if (onValueChange) {
                amount
                    ? handleInputChange(amount, asset, onValueChange)
                    : handleInputChange(0, asset, onValueChange);
            }
        },
        [onValueChange, handleInputChange, asset]
    );

    return (
        <div className='typography-caption flex h-10 w-full flex-row items-center justify-between rounded-lg bg-black-20 py-2 pl-2 pr-4 ring-starBlue focus-within:ring'>
            <div className='flex flex-row items-center gap-2'>
                <div className='typography-caption text-planetaryPurple'>
                    {field}
                </div>
                {informationText && !disabled && (
                    <InformationPopover>{informationText}</InformationPopover>
                )}
            </div>
            <div className='flex flex-row items-center gap-[10px]'>
                {disabled ? (
                    <span className='text-right text-[18px] font-semibold leading-6 text-neutral-8/30'>
                        {initialValue}
                    </span>
                ) : (
                    <InputBase
                        value={inputValue as number}
                        className='w-32 text-right text-[18px] font-semibold leading-6 text-neutral-8'
                        label={field}
                        onValueChange={(v: number | undefined) =>
                            handleAmountChange(v)
                        }
                        decimalPlacesAllowed={decimalPlacesAllowed}
                        maxLimit={maxLimit}
                    />
                )}
                {unit && <div className='text-neutral-4'>{unit}</div>}
            </div>
        </div>
    );
};
