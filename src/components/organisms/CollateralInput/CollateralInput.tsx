import { BigNumber } from 'ethers';
import { useCallback } from 'react';
import { InputBase, SizeDependentStylesConfig } from 'src/components/atoms';
import { PercentageSelector } from 'src/components/molecules';
import { CurrencySymbol, amountFormatterToBase, usdFormat } from 'src/utils';

interface CollateralInputProps {
    price: number;
    availableAmount: number;
    asset: CurrencySymbol;
    onAmountChange?: (v: BigNumber | undefined) => void;
    amount: number | undefined;
}

export const CollateralInput = ({
    price,
    availableAmount,
    asset,
    onAmountChange,
    amount,
}: CollateralInputProps) => {
    const handleInputChange = useCallback(
        (
            amount: number | undefined,
            asset: CurrencySymbol,
            onAmountChange: (v: BigNumber | undefined) => void
        ) => {
            let format = (x: number) => BigNumber.from(x);
            if (amountFormatterToBase && amountFormatterToBase[asset]) {
                format = amountFormatterToBase[asset];
            }

            onAmountChange(amount !== undefined ? format(amount) : undefined);
        },
        []
    );

    const handleAmountChange = useCallback(
        (amount: number | undefined) => {
            if (onAmountChange) {
                handleInputChange(amount, asset, onAmountChange);
            }
        },
        [asset, handleInputChange, onAmountChange]
    );

    const handleClick = useCallback(
        (percentage: number) => {
            const amount =
                percentage === 1
                    ? availableAmount
                    : Math.floor(percentage * availableAmount * 10000) /
                      10000.0;
            if (onAmountChange) {
                handleInputChange(amount, asset, onAmountChange);
            }
        },
        [availableAmount, onAmountChange, handleInputChange, asset]
    );

    return (
        <div className='flex h-[168px] w-full flex-col items-center'>
            <span className='typography-caption flex h-6 text-center text-secondary7'>
                Amount
            </span>
            <div className='flex h-full flex-1 flex-col items-center gap-1'>
                <InputBase
                    value={amount ? Number(amount.toFixed(4)) : undefined}
                    className='typography-headline-4 h-14 w-full text-center text-neutral-8'
                    onValueChange={handleAmountChange}
                    sizeDependentStyles={fontSize}
                />
                <div className='typography-body-2'>
                    <span className='text-center text-neutral-8'>
                        {usdFormat(price * (amount ?? 0), 2)}
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
