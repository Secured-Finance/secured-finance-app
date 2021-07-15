import React, { useState } from 'react';
import cm from './ChartInfo.module.scss';
import { Dropdown } from 'src/components/new/Dropdown';
import { FilIcon, ArrowIcon } from 'src/components/new/icons';
import { FieldValue } from 'src/components/new/FieldValue';

export const ChartInfo = () => {
    const [cureType, setCurveType] = useState('yield');
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
                            <span className={cm.priceValue}>$224,000.00</span>
                        }
                    />
                    <FieldValue
                        field={'24h Change (FIL)'}
                        value={
                            <span className={cm.changeValue}>
                                <ArrowIcon
                                    fill={'#de5f42'}
                                    size={14}
                                    direction={'down'}
                                />
                                -0.000135
                                <span className={cm.percentChange}>
                                    &nbsp;(-0.20%)
                                </span>
                            </span>
                        }
                        accent={'red'}
                    />
                </div>
            </div>

            <span className={cm.divider} />
        </div>
    );
};
