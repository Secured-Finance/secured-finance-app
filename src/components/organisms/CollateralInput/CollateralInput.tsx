import { BigNumber } from 'ethers';
import { ChangeEvent, useCallback, useState } from 'react';
import { PercentageSelector } from 'src/components/molecules';
import { amountFormatterToBase, CurrencySymbol, usdFormat } from 'src/utils';

interface CollateralInputProps {
    price: number;
    availableAmount: number;
    asset: CurrencySymbol;
    onAmountChange?: (v: BigNumber) => void;
}

export const CollateralInput = ({
    price,
    availableAmount,
    asset,
    onAmountChange,
}: CollateralInputProps) => {
    const [inputValue, setInputValue] = useState('');

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
        (e: ChangeEvent<HTMLInputElement>) => {
            const maybeNumber = e.target.value;
            const amount =
                isNaN(+maybeNumber) || maybeNumber === '' ? -1 : +maybeNumber;
            setInputValue(amount === -1 ? '' : maybeNumber);
            if (onAmountChange) {
                handleInputChange(amount, asset, onAmountChange);
            }
        },
        [asset, onAmountChange, handleInputChange]
    );

    const handleClick = useCallback(
        (percentage: number) => {
            const amount = parseFloat(
                (percentage * availableAmount).toFixed(2)
            );
            setInputValue(amount === 0 ? '' : amount.toString());
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
                <input
                    type='text'
                    placeholder='0'
                    value={inputValue}
                    onChange={handleAmountChange}
                    className='typography-headline-4 h-14 w-full bg-transparent text-center text-neutral-8 focus:outline-none'
                />
                <div className='typography-body-2'>
                    <span className='text-center text-neutral-8'>
                        {usdFormat(price * +inputValue, 2)}
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
