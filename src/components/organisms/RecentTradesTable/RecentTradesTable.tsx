import {
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
} from '@nextui-org/table';
import { toBytes32 } from '@secured-finance/sf-graph-client';
import queries from '@secured-finance/sf-graph-client/dist/graphclients';
import clsx from 'clsx';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import ArrowUpSquare from 'src/assets/icons/arrow-up-square.svg';
import { Spinner } from 'src/components/atoms';
import {
    useBlockExplorerUrl,
    useGraphClientHook,
    useIsSubgraphSupported,
} from 'src/hooks';
import useSF from 'src/hooks/useSecuredFinance';
import { currencyMap } from 'src/utils';
import { columns } from './constants';
import { RecentTradesTableProps } from './types';

export const RecentTradesTable = ({
    currency,
    maturity,
}: RecentTradesTableProps) => {
    const [timestamp, setTimestamp] = useState<number>(1643713200);
    const { blockExplorerUrl } = useBlockExplorerUrl();

    useEffect(() => {
        setTimestamp(Math.round(new Date().getTime() / 1000));
    }, []);

    const securedFinance = useSF();
    const currentChainId = securedFinance?.config.chain.id;

    const isSubgraphSupported = useIsSubgraphSupported(currentChainId);

    const { data: transactionHistory, loading } = useGraphClientHook(
        {
            currency: toBytes32(currency),
            maturity: maturity,
            from: -1,
            to: timestamp,
            first: 100,
        },
        queries.TransactionHistoryDocument,
        'transactionHistory',
        !isSubgraphSupported
    );

    return (
        <Table
            classNames={{
                base: 'laptop:h-full overflow-auto',
                wrapper: 'p-0 font-numerical text-xs leading-4 scrollbar-table',
            }}
            aria-label='Recent trades table'
        >
            <TableHeader>
                {columns.map(column => (
                    <TableColumn
                        key={column.key}
                        className={clsx(
                            'h-8 w-1/3 border-b border-neutral-600 px-4 font-normal text-neutral-300',
                            column.className
                        )}
                    >
                        {column.label}{' '}
                        {column.key === 'size' && `(${currency})`}
                    </TableColumn>
                ))}
            </TableHeader>
            <TableBody
                items={transactionHistory ?? []}
                loadingContent={<Spinner />}
                isLoading={loading}
                emptyContent={<span>No transactions found</span>}
            >
                {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                {(item: any) => (
                    <TableRow
                        key={1}
                        className='border-b border-neutral-600 text-white'
                    >
                        {/* TODO: change to execution price */}
                        <TableCell
                            className={clsx({
                                'text-secondary-300': item.side === 0,
                                'text-error-300': item.side === 1,
                            })}
                        >
                            {/* TODO: handle math properly. this is for display prototyping only */}
                            {(item.averagePrice * 100).toFixed(2)}
                        </TableCell>
                        <TableCell>
                            {currencyMap[currency].fromBaseUnit(
                                BigInt(+item.amount)
                            )}
                        </TableCell>
                        <TableCell>
                            {/* TODO: pass txHash here */}
                            <a
                                href={
                                    blockExplorerUrl
                                        ? `${blockExplorerUrl}/tx/${'0x1234'}`
                                        : ''
                                }
                                target='_blank'
                                rel='noreferrer'
                            >
                                <span className='flex items-center justify-end gap-1'>
                                    {/* TODO: check if this is right */}
                                    {dayjs(+item.createdAt).format(
                                        'HH:mm:ss'
                                    )}{' '}
                                    <ArrowUpSquare className='h-[15px] w-[15px]' />
                                </span>
                            </a>
                        </TableCell>
                    </TableRow>
                )}
            </TableBody>
        </Table>
    );
};
