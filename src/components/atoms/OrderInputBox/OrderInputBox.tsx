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
        <div className='typography-caption grid h-10 grid-cols-6 place-content-between rounded-lg bg-black-20 p-2 ring-inset ring-starBlue focus-within:ring-2'>
            <div className='col-span-2 flex flex-row items-center gap-2'>
                <div className='typography-caption whitespace-nowrap text-planetaryPurple'>
                    {field}
                </div>
                {informationText && !disabled && (
                    <InfoToolTip maxWidth='small' align='right'>
                        {informationText}
                    </InfoToolTip>
                )}
            </div>
            <div className='col-span-4 grid grid-flow-col place-content-end gap-10px'>
                {disabled ? (
                    <span className='text-right text-[18px] font-semibold leading-6 text-neutral-8/30'>
                        {initialValue ?? 0}
                    </span>
                ) : (
                    <InputBase
                        value={initialValue}
                        className='col col-span-2 flex text-right text-[18px] font-semibold leading-6 text-neutral-8'
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
