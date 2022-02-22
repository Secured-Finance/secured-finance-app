import { useState } from 'react';
import cm from './ChartInfo.module.scss';
import { Dropdown } from 'src/components/new/Dropdown';
import { FilIcon, ArrowIcon } from 'src/components/new/icons';
import { FieldValue } from 'src/components/new/FieldValue';
import { useFilUsd } from 'src/hooks/useAssetPrices';
import { percentFormat, usdFormat } from 'src/utils';

export const ChartInfo = () => {
    const [cureType, setCurveType] = useState('yield');
    const { price, change } = useFilUsd();

    return (
        <div className={cm.container}>
            <div className={cm.infoContainer}>
                <span className={cm.dropdownSection}>
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
                </span>
                <div className={cm.priceContainer}>
                    <FieldValue
                        field={'FIL/USD Price'}
                        value={
                            <span className={cm.priceValue}>
                                {usdFormat(price, 2)}
                            </span>
                        }
                    />
                    <FieldValue
                        field={'24h Change (FIL)'}
                        value={
                            change < 0 ? (
                                <span
                                    className={cm.changeValue}
                                    style={{ color: '#F23A32' }}
                                >
                                    <ArrowIcon
                                        fill={'#F23A32'}
                                        size={14}
                                        direction={'down'}
                                    />
                                    {percentFormat(change)}
                                </span>
                            ) : (
                                <span className={cm.changeValue}>
                                    <ArrowIcon
                                        fill={'#0F9D58'}
                                        size={14}
                                        direction={'up'}
                                    />
                                    {percentFormat(change)}
                                </span>
                            )
                        }
                        accent={'green'}
                    />
                </div>
            </div>

            <span className={cm.divider} />
        </div>
    );
};
