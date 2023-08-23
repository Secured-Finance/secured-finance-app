import { BigNumber } from 'ethers';
import { useCallback, useState, useEffect } from 'react';
import { InputBase } from 'src/components/atoms';
import { Tooltip } from 'src/components/templates';
import { amountFormatterToBase, CurrencySymbol } from 'src/utils';

interface OrderInputBoxProps {
    field: string;
    unit?: string;
    initialValue?: number | string | undefined;
    asset?: CurrencySymbol;
    disabled?: boolean;
    informationText?: string;
    decimalPlacesAllowed?: number;
    maxLimit?: number;
    onValueChange?: (v: number | BigNumber | undefined) => void;
    flag?: boolean;
}

export const OrderInputBox = ({
    field,
    unit,
    initialValue,
    asset,
    disabled = false,
    informationText,
    decimalPlacesAllowed,
    maxLimit,
    onValueChange,
    flag,
}: OrderInputBoxProps) => {
    const [inputAmount, setInputAmount] = useState(initialValue);

    useEffect(() => {
        if (flag) {
            setInputAmount(initialValue);
        }
    }, [flag, initialValue]);

    const handleInputChange = useCallback(
        (
            amount: number | undefined,
            asset: CurrencySymbol | undefined,
            onValueChange: (v: number | BigNumber | undefined) => void
        ) => {
            let format = (x: number) => BigNumber.from(x);
            if (
                asset &&
                amountFormatterToBase &&
                amountFormatterToBase[asset]
            ) {
                format = amountFormatterToBase[asset];
            }
            asset ? onValueChange(format(amount ?? 0)) : onValueChange(amount);
        },
        []
    );

    const handleAmountChange = useCallback(
        (amount: number | undefined) => {
            setInputAmount(amount);
            if (onValueChange) {
                handleInputChange(amount, asset, onValueChange);
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
                    <Tooltip align='right' maxWidth='small'>
                        {informationText}
                    </Tooltip>
                )}
            </div>
            <div className='flex flex-row items-center gap-[10px]'>
                {disabled ? (
                    <span className='text-right text-[18px] font-semibold leading-6 text-neutral-8/30'>
                        {initialValue ?? 0}
                    </span>
                ) : (
                    <InputBase
                        value={inputAmount as number}
                        className='w-32 text-right text-[18px] font-semibold leading-6 text-neutral-8'
                        label={field}
                        onValueChange={handleAmountChange}
                        decimalPlacesAllowed={decimalPlacesAllowed}
                        maxLimit={maxLimit}
                    />
                )}
                {unit && <div className='text-neutral-4'>{unit}</div>}
            </div>
        </div>
    );
};
