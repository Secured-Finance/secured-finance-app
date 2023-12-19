import { useCallback } from 'react';
import { InputBase, SizeDependentStylesConfig } from 'src/components/atoms';
import { PercentageSelector } from 'src/components/molecules';
import { CurrencySymbol, usdFormat } from 'src/utils';

interface CollateralInputProps {
    price: number;
    availableAmount: number;
    asset: CurrencySymbol;
    onAmountChange?: (v: string | undefined) => void;
    amount: string | undefined;
}

export const CollateralInput = ({
    price,
    availableAmount,
    onAmountChange,
    amount,
}: CollateralInputProps) => {
    const handleAmountChange = useCallback(
        (inputAmount: string | undefined) => {
            if (amount !== undefined) {
                return;
            }
            if (onAmountChange) {
                onAmountChange(inputAmount);
            }
        },
        [amount, onAmountChange]
    );

    const handleClick = useCallback(
        (percentage: number) => {
            const amount =
                percentage === 1
                    ? availableAmount
                    : Math.floor(percentage * availableAmount * 10000) /
                      10000.0;
            if (onAmountChange) {
                onAmountChange(amount.toString());
            }
        },
        [availableAmount, onAmountChange]
    );

    return (
        <div className='flex h-[168px] w-full flex-col items-center'>
            <span className='typography-caption flex h-6 text-center text-secondary7'>
                Amount
            </span>
            <div className='flex h-full flex-1 flex-col items-center gap-1'>
                <InputBase
                    value={amount}
                    className='typography-headline-4 h-14 w-full text-center text-neutral-8'
                    onValueChange={handleAmountChange}
                    sizeDependentStyles={fontSize}
                />
                <div className='typography-body-2'>
                    <span className='text-center text-neutral-8'>
                        {usdFormat(price * Number(amount ?? ''), 2)}
                    </span>
                    <span className='pl-2 text-center text-neutral-4'>USD</span>
                </div>
            </div>
            <PercentageSelector
                onClick={percentage => handleClick(percentage)}
            ></PercentageSelector>
        </div>
    );
};

const fontSize: SizeDependentStylesConfig = {
    shortText: { maxChar: 12, styles: 'text-3xl' },
    mediumText: { maxChar: 15, styles: 'text-2xl' },
    longText: { maxChar: Infinity, styles: 'text-xl' },
};
