import { createColumnHelper } from '@tanstack/react-table';
import { BigNumber } from 'ethers';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { Chip, CurrencyIcon, CurrencyItem } from 'src/components/atoms';
import { CoreTable, TableHeader } from 'src/components/molecules';
import { ContractDetailDialog } from 'src/components/organisms';
import { getPriceMap } from 'src/store/assetPrices/selectors';
import { RootState } from 'src/store/types';
import { currencyMap, CurrencySymbol, Rate } from 'src/utils';

export type ActiveTrade = {
    position: 'Borrow' | 'Lend';
    contract: string;
    apy: Rate;
    notional: BigNumber;
    currency: CurrencySymbol;
    presentValue: BigNumber;
    dayToMaturity: number;
    forwardValue: BigNumber;
};

const columnHelper = createColumnHelper<ActiveTrade>();

const AmountCell = ({
    ccy,
    amount,
    priceList,
}: {
    ccy: CurrencySymbol;
    amount: BigNumber;
    priceList: Record<CurrencySymbol, number>;
}) => {
    return (
        <CurrencyItem
            ccy={ccy}
            amount={currencyMap[ccy].fromBaseUnit(amount)}
            price={priceList[ccy]}
            align='right'
        />
    );
};

export const ActiveTradeTable = ({ data }: { data: Array<ActiveTrade> }) => {
    const priceList = useSelector((state: RootState) => getPriceMap(state));

    const columns = useMemo(
        () => [
            columnHelper.accessor('position', {
                cell: info => (
                    <div className='flex justify-center'>
                        <Chip label={info.getValue()} />
                    </div>
                ),
                header: header => (
                    <TableHeader
                        title='Position'
                        sortingHandler={header.column.getToggleSortingHandler()}
                        isSorted={header.column.getIsSorted()}
                    />
                ),
            }),
            columnHelper.accessor('contract', {
                cell: info => info.getValue(),
                header: header => (
                    <TableHeader
                        title='Contract'
                        sortingHandler={header.column.getToggleSortingHandler()}
                        isSorted={header.column.getIsSorted()}
                    />
                ),
            }),
            columnHelper.accessor('apy', {
                cell: info => info.getValue().toPercent(),
                header: header => (
                    <TableHeader
                        title='APY'
                        sortingHandler={header.column.getToggleSortingHandler()}
                        isSorted={header.column.getIsSorted()}
                    />
                ),
            }),
            columnHelper.accessor('currency', {
                cell: info => (
                    <div className='flex justify-center'>
                        <CurrencyIcon ccy={info.getValue()} />
                    </div>
                ),
                header: () => '',
            }),
            columnHelper.accessor('presentValue', {
                cell: info => {
                    const ccy = info.row.original.currency;
                    return (
                        <AmountCell
                            ccy={ccy}
                            amount={info.getValue()}
                            priceList={priceList}
                        />
                    );
                },

                header: header => (
                    <TableHeader
                        title='Present Value'
                        sortingHandler={header.column.getToggleSortingHandler()}
                        isSorted={header.column.getIsSorted()}
                    />
                ),
            }),
            columnHelper.accessor('dayToMaturity', {
                cell: info => `${info.getValue()} Days`,
                header: header => (
                    <TableHeader
                        title='DTM'
                        sortingHandler={header.column.getToggleSortingHandler()}
                        isSorted={header.column.getIsSorted()}
                    />
                ),
            }),
            columnHelper.accessor('forwardValue', {
                cell: info => {
                    const ccy = info.row.original.currency;
                    return (
                        <AmountCell
                            ccy={ccy}
                            amount={info.getValue()}
                            priceList={priceList}
                        />
                    );
                },
                header: header => (
                    <TableHeader
                        title='Forward Value'
                        sortingHandler={header.column.getToggleSortingHandler()}
                        isSorted={header.column.getIsSorted()}
                    />
                ),
            }),
        ],
        [priceList]
    );

    const [displayContractDetails, setDisplayContractDetails] = useState(false);
    return (
        <>
            <CoreTable
                data={data}
                columns={columns}
                onLineClick={() => setDisplayContractDetails(true)}
            />
            <ContractDetailDialog
                isOpen={displayContractDetails}
                onClose={() => setDisplayContractDetails(false)}
            />
        </>
    );
};
