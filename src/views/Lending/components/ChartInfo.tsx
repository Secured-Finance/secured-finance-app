import { useState } from 'react';
import { Dropdown } from 'src/components/new/Dropdown';
import { FieldValue } from 'src/components/new/FieldValue';
import { ArrowIcon, FilIcon } from 'src/components/new/icons';
import { useFilUsd } from 'src/hooks/useAssetPrices';
import { percentFormat, usdFormat } from 'src/utils';

export const ChartInfo = () => {
    const [cureType, setCurveType] = useState('yield');
    const { price, change } = useFilUsd();

    return (
        <div className='flex items-center justify-between space-x-2'>
            <div className='flex w-2/6'>
                <Dropdown
                    options={[
                        {
                            value: 'fil',
                            label: 'FIL',
                            icon: <FilIcon size={27} fill={'#fff'} />,
                        },
                    ]}
                    value={'fil'}
                    style={{ width: 104 }}
                    noBorder
                />
            </div>
            <div className='flex w-2/6'>
                <Dropdown
                    options={[
                        {
                            value: 'yield',
                            label: 'Yield Curve',
                        },
                        {
                            value: 'price',
                            label: 'Price Curve',
                        },
                    ]}
                    value={cureType}
                    style={{ width: 164 }}
                    onChange={e => setCurveType(e.currentTarget.value)}
                    noBorder
                />
            </div>
            <div className='flex w-1/6'>
                <FieldValue
                    field='FIL/USD Price'
                    value={
                        <span className='font-bold text-white'>
                            {usdFormat(price, 2)}
                        </span>
                    }
                />
            </div>
            <div className='flex w-1/6 flex-nowrap'>
                <FieldValue
                    field='24h Change (FIL)'
                    value={
                        change < 0 ? (
                            <PriceTicker change={change} direction='down' />
                        ) : (
                            <PriceTicker change={change} direction='up' />
                        )
                    }
                    accent={'green'}
                />
            </div>

            <span className='mx-6 border-b-2 border-solid border-darkGrey' />
        </div>
    );
};

const PriceTicker = ({
    change,
    direction,
}: {
    change: number;
    direction: 'up' | 'down';
}) => {
    var color = '#0F9D58';
    if (direction === 'up') {
        color = '#0F9D58';
    } else if (direction === 'down') {
        color = '#F23A32';
    }

    return (
        <span className='flex items-center font-bold'>
            <ArrowIcon fill={color} size={14} direction={direction} />
            {percentFormat(change)}
        </span>
    );
};
