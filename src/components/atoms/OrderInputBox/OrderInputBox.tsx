import { BigNumber } from 'ethers';
import { useCallback } from 'react';
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
}: OrderInputBoxProps) => {
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
            if (onValueChange) {
                handleInputChange(amount, asset, onValueChange);
            }
        },
        [onValueChange, handleInputChange, asset]
    );

    return (
        <div className='typography-caption grid h-10 grid-cols-2 place-content-between rounded-lg bg-black-20 p-2 ring-inset ring-starBlue focus-within:ring-2'>
            <div className='flex flex-row items-center gap-2'>
                <div className='typography-caption whitespace-nowrap text-planetaryPurple'>
                    {field}
                </div>
                {informationText && !disabled && (
                    <Tooltip align='right' maxWidth='small'>
                        {informationText}
                    </Tooltip>
                )}
            </div>
            <div className='grid grid-flow-col place-content-end gap-10px'>
                {disabled ? (
                    <span className='text-right text-[18px] font-semibold leading-6 text-neutral-8/30'>
                        {initialValue ?? 0}
                    </span>
                ) : (
                    <InputBase
                        value={initialValue as number}
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
