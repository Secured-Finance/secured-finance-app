import { ArrowUpIcon } from '@heroicons/react/outline';
import { createColumnHelper } from '@tanstack/react-table';
import { BigNumber } from 'ethers';
import { useMemo } from 'react';
import {
    CoreTable,
    HorizontalTab,
    TableHeader,
} from 'src/components/molecules';
import { percentFormat, Rate } from 'src/utils';

export type OrderBookEntry = {
    amount: BigNumber;
    apy: Rate;
};

const columnHelper = createColumnHelper<OrderBookEntry>();
export const OrderWidget = ({ data }: { data: Array<OrderBookEntry> }) => {
    const columns = useMemo(
        () => [
            columnHelper.accessor('amount', {
                cell: info => info.getValue().toString(),
                header: () => <TableHeader title='Amount' />,
            }),
            columnHelper.accessor('apy', {
                cell: info => info.getValue().toPercent(),
                header: () => (
                    <div className='px-4'>
                        <TableHeader title='APY' />
                    </div>
                ),
            }),
        ],
        []
    );

    return (
        <>
            <HorizontalTab
                tabTitles={['Order Book', 'Market Trades', 'My Orders']}
            >
                <>
                    <div className='flex h-14 flex-row justify-center gap-1 border-b border-white-10 bg-black-20'>
                        <ArrowUpIcon className='mt-1.5 flex h-4 text-green' />

                        <div className='typography-portfolio-heading flex text-white'>
                            {percentFormat(20)}
                        </div>
                    </div>
                    <div className='flex flex-row'>
                        <CoreTable
                            data={data}
                            columns={columns}
                            options={{
                                align: 'right',
                            }}
                        />
                        <CoreTable
                            data={data}
                            columns={columns}
                            options={{
                                align: 'left',
                            }}
                        />
                    </div>
                </>
            </HorizontalTab>
        </>
    );
};
