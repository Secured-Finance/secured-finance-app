import { ChangeEvent, useMemo, useState } from 'react';
import DropdownSelector from 'src/components/atoms/DropdownSelector';
import { Option } from 'src/components/atoms/DropdownSelector/DropdownSelector';

export const AssetSelector = ({
    options,
    priceList,
    transform = (v: string) => v,
}: {
    options: Readonly<Array<Option>>;
    priceList: Record<string, number>;
    transform?: (v: string) => string;
}) => {
    const [asset, setAsset] = useState('');
    const [amount, setAmount] = useState(0);
    const amountInUsd = useMemo(() => {
        if (!asset) {
            return 0;
        }
        return new Intl.NumberFormat('en-us', {
            minimumFractionDigits: 0,
        }).format(priceList[asset] * amount);
    }, [asset, amount, priceList]);

    return (
        <div className='w-72 flex-col items-start justify-start space-y-2'>
            <div className='flex flex-row items-start justify-between'>
                <label className='typography-caption-2 ml-2 text-planetaryPurple'>
                    Asset
                </label>
                <div
                    className='typography-caption-3 mr-1 text-white-60'
                    data-testid='asset-selector-usd'
                >
                    {`~ ${amountInUsd} USD`}
                </div>
            </div>
            <div className='flex h-14 w-72 flex-row items-center justify-between space-x-2 rounded-lg bg-black-20 py-2 pl-2 pr-4 focus-within:ring'>
                <div>
                    <DropdownSelector
                        optionList={options}
                        onChange={setAsset}
                    />
                </div>
                <div>
                    <input
                        type='text'
                        placeholder='0'
                        className='typography-body-1 h-8 w-24 rounded-lg bg-transparent p-2 text-right font-bold text-white placeholder-opacity-50'
                        onChange={(e: ChangeEvent<HTMLInputElement>) => {
                            const maybeNumber = e.target.value;
                            isNaN(+maybeNumber)
                                ? setAmount(0)
                                : setAmount(+maybeNumber);
                        }}
                        value={amount}
                    />
                </div>

                <div
                    className='typography-caption ml-2 text-white-60'
                    data-testid='asset-selector-transformed-value'
                >
                    {transform(asset)}
                </div>
            </div>
        </div>
    );
};
