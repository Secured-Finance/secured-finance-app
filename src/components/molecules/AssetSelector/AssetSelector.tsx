import { ChangeEvent, useMemo, useState } from 'react';
import { DropdownSelector, Option } from 'src/components/atoms';

export const AssetSelector = ({
    options,
    selected,
    priceList,
    transform = (v: string) => v,
    onAssetChange,
    onAmountChange,
}: {
    options: Readonly<Array<Option>>;
    selected: Option;
    priceList: Record<string, number>;
    transform?: (v: string) => string;
    onAssetChange?: (v: string) => void;
    onAmountChange?: (v: number) => void;
}) => {
    const [assetValue, setAssetValue] = useState(selected.value);
    const [amount, setAmount] = useState(0);

    const selectedOption = useMemo(
        () => options.find(o => o.value === assetValue),
        [options, assetValue]
    );

    const amountInUsd = useMemo(() => {
        if (!selectedOption.value) {
            return 0;
        }
        return new Intl.NumberFormat('en-us', {
            minimumFractionDigits: 0,
        }).format(priceList[selectedOption.value] * amount);
    }, [selectedOption.value, priceList, amount]);

    const handleAssetChange = (v: string) => {
        setAssetValue(v);
        if (onAssetChange) {
            onAssetChange(v);
        }
    };

    const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
        const maybeNumber = e.target.value;
        let amount = 0;
        isNaN(+maybeNumber) ? (amount = 0) : (amount = +maybeNumber);
        setAmount(amount);
        if (onAmountChange) {
            onAmountChange(amount);
        }
    };

    return (
        <div className='w-72 flex-col items-start justify-start space-y-2'>
            <div className='flex flex-row items-start justify-between'>
                <div className='typography-caption-2 ml-2 text-planetaryPurple'>
                    Asset
                </div>
                <div
                    className='typography-caption-3 mr-1 text-white-60'
                    data-testid='asset-selector-usd'
                >
                    {`~ ${amountInUsd} USD`}
                </div>
            </div>
            <div className='flex h-14 flex-row items-center justify-between space-x-2 rounded-lg bg-black-20 py-2 pl-2 pr-4 focus-within:ring'>
                <DropdownSelector
                    optionList={options}
                    selected={selected}
                    onChange={handleAssetChange}
                />
                <input
                    type='text'
                    placeholder='0'
                    className='typography-body-1 h-8 w-20 rounded-lg bg-transparent p-2 text-right font-bold text-white placeholder-opacity-50'
                    onChange={handleAmountChange}
                    value={amount}
                />

                <div
                    className='typography-caption ml-2 flex text-white-60'
                    data-testid='asset-selector-transformed-value'
                >
                    {transform(selectedOption.name)}
                </div>
            </div>
        </div>
    );
};
