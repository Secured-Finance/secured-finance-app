import clsx from 'clsx';
import { useCallback } from 'react';
import { InputBase } from 'src/components/atoms';
import { InfoToolTip } from 'src/components/molecules';

interface OrderInputBoxProps {
    field: string;
    unit?: string;
    initialValue?: string | undefined;
    disabled?: boolean;
    informationText?: string;
    decimalPlacesAllowed?: number;
    maxLimit?: number;
    onValueChange?: (v: string | undefined) => void;
    bgClassName?: string;
}

export const OrderInputBox = ({
    field,
    unit,
    initialValue,
    disabled = false,
    informationText,
    decimalPlacesAllowed,
    maxLimit,
    onValueChange,
    bgClassName = 'bg-black-20',
}: OrderInputBoxProps) => {
    const handleAmountChange = useCallback(
        (amount: string | undefined) => {
            if (onValueChange) {
                onValueChange(amount);
            }
        },
        [onValueChange]
    );

    return (
        <div
            className={clsx(
                'typography-caption grid h-10 grid-cols-2 place-content-between items-center rounded-lg border border-neutral-500 bg-neutral-900 px-3 py-2 ring-inset',
                bgClassName
            )}
        >
            <div className='flex flex-row items-center gap-2'>
                <div className='laptop:typography-desktop-body-4 whitespace-nowrap text-xs text-neutral-400'>
                    {field}
                </div>
                {informationText && !disabled && (
                    <InfoToolTip>
                        <div>{informationText}</div>
                    </InfoToolTip>
                )}
            </div>
            <div className='grid grid-flow-col place-content-end gap-10px'>
                {disabled ? (
                    <span
                        className='text-right text-base font-semibold leading-6 text-neutral-500 laptop:text-[1.125rem]'
                        data-testid='disabled-input'
                    >
                        {initialValue ?? 0}
                    </span>
                ) : (
                    <InputBase
                        value={initialValue}
                        className='col col-span-2 flex text-right text-base font-semibold leading-6 text-neutral-50 laptop:text-[1.125rem]'
                        label={field}
                        onValueChange={handleAmountChange}
                        decimalPlacesAllowed={decimalPlacesAllowed}
                        maxLimit={maxLimit}
                    />
                )}
                {unit && <div className='text-neutral-400'>{unit}</div>}
            </div>
        </div>
    );
};
