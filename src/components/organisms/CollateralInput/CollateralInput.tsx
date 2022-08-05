import { BigNumber } from 'ethers';
import { ChangeEvent, useCallback, useMemo, useState } from 'react';
import { PercentageSelector } from 'src/components/molecules';
import { Currency, getCurrencyMapAsList, usdFormat } from 'src/utils';

interface CollateralInputProps {
    price: number;
    availableAmount: number;
    asset: Currency;
    onAmountChange?: (v: BigNumber) => void;
}

export const CollateralInput: React.FC<CollateralInputProps> = ({
    price,
    availableAmount,
    asset,
    onAmountChange,
}) => {
    const [amount, setAmount] = useState(0);
    const [inputValue, setInputValue] = useState('');

    const amountFormatterMap = useMemo(
        () =>
            getCurrencyMapAsList().reduce<
                Record<Currency, (value: number) => BigNumber>
            >(
                (acc, ccy) => ({
                    ...acc,
                    [ccy.shortName]: ccy.toBaseUnit,
                }),
                {} as Record<Currency, (value: number) => BigNumber>
            ),
        []
    );

    const handleInputChange = useCallback(
        (
            amount: number,
            asset: Currency,
            onAmountChange: (v: BigNumber) => void
        ) => {
            let format = (x: number) => BigNumber.from(x);
            if (amountFormatterMap && amountFormatterMap[asset]) {
                format = amountFormatterMap[asset];
            }

            onAmountChange(format(amount));
        },
        [amountFormatterMap]
    );

    const handleAmountChange = useCallback(
        (e: ChangeEvent<HTMLInputElement>) => {
            const maybeNumber = e.target.value;
            let amount = 0;
            isNaN(+maybeNumber) ? (amount = 0) : (amount = +maybeNumber);
            setAmount(amount);
            setInputValue(amount === 0 ? '0' : maybeNumber);
            if (onAmountChange) {
                handleInputChange(amount, asset, onAmountChange);
            }
        },
        [asset, onAmountChange, handleInputChange]
    );

    const handleClick = useCallback(
        (percentage: number) => {
            let amount = 0;
            const maybeNumber = (percentage * availableAmount).toString();
            isNaN(+maybeNumber) ? (amount = 0) : (amount = +maybeNumber);
            setAmount(amount);
            setInputValue(amount === 0 ? '0' : maybeNumber);
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
                    className='typography-headline-4 focus: h-14 w-full bg-transparent text-center text-neutral-8 focus:outline-none'
                />
                <div className='typography-body-2'>
                    <span className='text-center text-neutral-8'>
                        {usdFormat(price * amount, 2)}
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
