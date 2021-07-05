import React from 'react';
import cm from './ChartInfo.module.scss';
import { Dropdown } from 'src/components/new/Dropdown';
import { FilIcon, ArrowIcon } from 'src/components/new/icons';
import { FieldValue } from 'src/components/new/FieldValue';

export const ChartInfo = () => {
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
                        noBorders
                    />
                    <Dropdown
                        options={[
                            {
                                value: 'yield',
                                label: 'Yield Curve',
                            },
                        ]}
                        value={'yield'}
                        style={{ width: 164 }}
                        noBorders
                    />
                </span>
                <span className={cm.divider} />
                <span className={cm.yieldSection}>
                    <FieldValue field={'Current Yield'} value={'5.00%'} light />

                    <FieldValue field={'1Y Yield'} value={'4.25%'} />
                    <FieldValue field={'3Y Yield'} value={'4.55%'} />
                    <FieldValue field={'5Y Yield'} value={'5.00%'} />
                </span>
            </div>

            <div className={cm.priceContainer}>
                <FieldValue
                    field={'FIL/USD Price'}
                    value={<span className={cm.priceValue}>$224,000.00</span>}
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
                            <span className={cm.percentChange}>(-0.20%)</span>
                        </span>
                    }
                />
            </div>
        </div>
    );
};
