import { useCallback } from 'react';
import { InputBase, SizeDependentStylesConfig } from 'src/components/atoms';
import { PercentageSelector } from 'src/components/molecules';
import { CurrencySymbol, PriceFormatter } from 'src/utils';

interface CollateralInputProps {
    price: number;
    availableAmount: number;
    asset: CurrencySymbol;
    onAmountChange?: (v: string | undefined) => void;
    amount: string | undefined;
    fullCoverage: boolean;
    setFullCoverage: (v: boolean) => void;
}

export const CollateralInput = ({
    price,
    availableAmount,
    onAmountChange,
    amount,
    fullCoverage,
    setFullCoverage,
}: CollateralInputProps) => {
    const handleAmountChange = useCallback(
        (inputAmount: string | undefined) => {
            if (
                amount !== undefined &&
                Number(amount) !== 0 &&
                Number(inputAmount) ===
                    Math.floor(Number(amount) * 10000) / 10000.0
            ) {
                return;
            }
            if (fullCoverage) {
                // to enable typing to edit value
                setFullCoverage(false);
            }
            if (onAmountChange) {
                onAmountChange(inputAmount);
            }
        },
        [amount, onAmountChange, fullCoverage, setFullCoverage]
    );

    const handleClick = useCallback(
        (percentage: number) => {
            if (percentage === 1) {
                setFullCoverage(true);
                return;
            }

            setFullCoverage(false);

            const amount =
                Math.floor(percentage * availableAmount * 10000) / 10000.0;

            if (onAmountChange) {
                onAmountChange(amount.toString());
            }
        },
        [availableAmount, onAmountChange, setFullCoverage]
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
                        {PriceFormatter.formatUSD(
                            price * Number(amount ?? ''),
                            2
                        )}
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
