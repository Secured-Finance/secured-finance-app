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
                'typography-caption grid h-10 grid-cols-2 place-content-between rounded-lg py-2 pl-3 pr-4 ring-inset ring-starBlue focus-within:ring-2',
                bgClassName
            )}
        >
            <div className='flex flex-row items-center gap-2'>
                <div className='typography-caption whitespace-nowrap text-planetaryPurple'>
                    {field}
                </div>
                {informationText && !disabled && (
                    <InfoToolTip maxWidth='small' align='right'>
                        {informationText}
                    </InfoToolTip>
                )}
            </div>
            <div className='grid grid-flow-col place-content-end gap-10px'>
                {disabled ? (
                    <span
                        className='text-right text-base font-semibold leading-6 text-neutral-300'
                        data-testid='disabled-input'
                    >
                        {initialValue ?? 0}
                    </span>
                ) : (
                    <InputBase
                        value={initialValue}
                        className='col col-span-2 flex text-right text-[1.125rem] font-semibold leading-6 text-neutral-8'
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
