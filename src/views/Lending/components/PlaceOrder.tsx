import React from 'react';
import { Tabs } from 'src/components/new/Tabs';
import LendBorrowTable from './LendBorrowTable';

interface IPlaceOrder {
    lendingRates: Array<number>;
    borrowRates: Array<number>;
}

export const PlaceOrder: React.FC<IPlaceOrder> = props => {
    const [selectedTab, setTab] = React.useState<string>('lend');

    return (
        <div className='-mt-5 flex w-3/4 flex-col overflow-y-hidden pb-5 pl-6'>
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

            <LendBorrowTable selectedTab={selectedTab} {...props} />
        </div>
    );
};
