import { BigNumber } from 'ethers';
import { useCallback, useState } from 'react';
import { InputBase } from 'src/components/atoms';
import { PercentageSelector } from 'src/components/molecules';
import { amountFormatterToBase, CurrencySymbol, usdFormat } from 'src/utils';

interface CollateralInputProps {
    price: number;
    availableAmount?: number;
    asset: CurrencySymbol;
    onAmountChange?: (v: BigNumber) => void;
}

export const CollateralInput = ({
    price,
    availableAmount,
    asset,
    onAmountChange,
}: CollateralInputProps) => {
    const [amount, setAmount] = useState<number | undefined>();

    const handleInputChange = useCallback(
        (
            amount: number,
            asset: CurrencySymbol,
            onAmountChange: (v: BigNumber) => void
        ) => {
            let format = (x: number) => BigNumber.from(x);
            if (amountFormatterToBase && amountFormatterToBase[asset]) {
                format = amountFormatterToBase[asset];
            }

            onAmountChange(format(amount));
        },
        []
    );

    const handleAmountChange = useCallback(
        (amount: number | undefined) => {
            setAmount(amount);
            if (onAmountChange) {
                handleInputChange(amount ?? 0, asset, onAmountChange);
            }
        },
        [asset, handleInputChange, onAmountChange]
    );

    const handleClick = useCallback(
        (percentage: number) => {
            if (!availableAmount) {
                setAmount(0);
                return;
            }
            const amount =
                Math.floor(percentage * availableAmount * 10000) / 10000.0;
            setAmount(amount);
            if (onAmountChange) {
                handleInputChange(amount, asset, onAmountChange);
            }
        },
        [availableAmount, onAmountChange, asset, handleInputChange]
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
