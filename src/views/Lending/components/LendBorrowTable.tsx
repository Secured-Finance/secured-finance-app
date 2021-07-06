import React from 'react';
import cm from './LendBorrowTable.module.scss';
import { Tabs } from 'src/components/new/Tabs';
import { Dropdown } from 'src/components/new/Dropdown';
import { Input } from 'src/components/new/Input';
import { FilIcon } from 'src/components/new/icons';

export const LendBorrowTable = () => {
    const [selectedTab, setTab] = React.useState<string>('lend');
    const [selectedCurrency, setSelectedCurrency] =
        React.useState<string>('fil');
    return (
        <div className={cm.container}>
            <Tabs
                options={[
                    { value: 'lend', label: 'Lend' },
                    {
                        value: 'borrow',
                        label: 'Borrow',
                    },
                ]}
                selected={selectedTab}
                onChange={setTab}
                large
            />
            <div className={cm.table}>
                <span className={cm.tableTitle}>Currency</span>
                <span className={cm.row}>
                    <Dropdown
                        options={[
                            {
                                value: 'fil',
                                label: 'FIL',
                                icon: <FilIcon size={24} fill={'#fff'} />,
                            },
                        ]}
                        value={selectedCurrency}
                        onChange={e =>
                            setSelectedCurrency(e.currentTarget.value)
                        }
                        noBorder
                    />
                    <span className={cm.divider} />
                    <Input value={'10 000'} noBorder alignRight />
                </span>
                <span className={cm.subtitle}>
                    <span>Balance: $12,000.00</span>
                    <span className={cm.USDValue}>~$224,000.00</span>
                </span>
            </div>
        </div>
    );
};
