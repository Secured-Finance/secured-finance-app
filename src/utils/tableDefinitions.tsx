/* eslint-disable react/display-name */
import {
    AccessorFn,
    ColumnHelper,
    HeaderContext,
    Row,
} from '@tanstack/react-table';
import { BigNumber } from 'ethers';
import { Chip, CurrencyItem, PriceYieldItem } from 'src/components/atoms';
import { TableContractCell, TableHeader } from 'src/components/molecules';
import { AssetPriceMap } from 'src/store/assetPrices/selectors';
import { ColorFormat } from 'src/types';
import { formatTimestamp } from 'src/utils';
import { currencyMap, hexToCurrencySymbol } from './currencyList';
import { LoanValue, Maturity } from './entities';

export const tableHeaderDefinition =
    <TData,>(title: string, titleHint?: string) =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (header: HeaderContext<TData, any>) =>
        (
            <TableHeader
                title={title}
                titleHint={titleHint}
                sortingHandler={header.column.getToggleSortingHandler()}
                isSorted={header.column.getIsSorted()}
            />
        );

type CurrencyProperty = {
    currency: string;
};
type SideProperty = {
    side: number;
};
type AmountProperty = {
    amount: BigNumber;
};
type AmountColumnType = (AmountProperty | SideProperty) & CurrencyProperty;

function hasAmountProperty<T extends AmountColumnType>(
    obj: T
): obj is T & AmountProperty {
    return (obj as AmountProperty).amount !== undefined;
}

function hasSideProperty<T extends AmountColumnType>(
    obj: T
): obj is T & SideProperty {
    return (obj as SideProperty).side !== undefined;
}
export const amountColumnDefinition = <T extends AmountColumnType>(
    columnHelper: ColumnHelper<T>,
    title: string,
    id: string,
    accessor: AccessorFn<T, BigNumber>,
    options: {
        color: boolean;
        compact: boolean;
        priceList?: AssetPriceMap;
    },
    titleHint?: string
) => {
    return columnHelper.accessor(accessor, {
        id: id,
        cell: info => {
            const ccy = hexToCurrencySymbol(info.row.original.currency);
            if (!ccy) return null;

            let color: ColorFormat['color'];
            if (hasSideProperty(info.row.original)) {
                color = info.row.original.side === 1 ? 'negative' : 'positive';
            } else if (hasAmountProperty(info.row.original)) {
                color = info.row.original.amount.isNegative()
                    ? 'negative'
                    : 'positive';
            } else {
                // do nothing
            }

            return (
                <div className='flex w-full items-center justify-end whitespace-nowrap pr-[15%]'>
                    <div className='flex justify-end'>
                        <CurrencyItem
                            amount={currencyMap[ccy].fromBaseUnit(
                                info.getValue() as BigNumber
                            )}
                            ccy={ccy}
                            align='right'
                            price={options.priceList?.[ccy]}
                            color={options.color ? color : undefined}
                            compact={options.compact}
                        />
                    </div>
                </div>
            );
        },
        header: tableHeaderDefinition(title, titleHint),
    });
};

export const loanTypeColumnDefinition = <T extends SideProperty>(
    columnHelper: ColumnHelper<T>,
    title: string,
    id: string
) => {
    const assessorFn: AccessorFn<T, number> = row => row.side;

    return columnHelper.accessor(assessorFn, {
        id: id,
        cell: info => {
            const value = info.getValue();
            return (
                <div className='flex justify-center'>
                    <Chip
                        label={value.toString() === '1' ? 'Borrow' : 'Lend'}
                    />
                </div>
            );
        },
        header: tableHeaderDefinition(title),
    });
};

export const loanTypeFromAmountColumnDefinition = <T extends AmountProperty>(
    columnHelper: ColumnHelper<T>,
    title: string,
    id: string
) => {
    const assessorFn: AccessorFn<T, BigNumber> = row => row.amount;

    return columnHelper.accessor(assessorFn, {
        id: id,
        cell: info => {
            return (
                <div className='flex justify-center'>
                    <Chip
                        label={info.getValue().isNegative() ? 'Borrow' : 'Lend'}
                    />
                </div>
            );
        },
        header: tableHeaderDefinition(title),
    });
};

export const contractColumnDefinition = <
    T extends { maturity: string | number; currency: string }
>(
    columnHelper: ColumnHelper<T>,
    title: string,
    id: string,
    variant: 'compact' | 'default' | 'currencyOnly' = 'default'
) => {
    const assessorFn: AccessorFn<T, string> = row => row.maturity.toString();

    return columnHelper.accessor(assessorFn, {
        id: id,
        cell: info => (
            <div className='flex justify-center'>
                <TableContractCell
                    maturity={new Maturity(info.getValue())}
                    ccyByte32={info.row.original.currency}
                    variant={variant}
                />
            </div>
        ),
        header: tableHeaderDefinition(title),
        sortingFn: contractSortingFn,
    });
};

const contractSortingFn = <
    T extends { maturity: string | number; currency: string }
>(
    rowA: Row<T>,
    rowB: Row<T>,
    _column: string
) => {
    const ccyA = hexToCurrencySymbol(rowA.original.currency)?.toString() ?? '';
    const ccyB = hexToCurrencySymbol(rowB.original.currency)?.toString() ?? '';

    if (ccyA === ccyB) {
        const matA = rowA.original.maturity.toString();
        const matB = rowB.original.maturity.toString();
        return matA.localeCompare(matB);
    }

    return ccyA.localeCompare(ccyB);
};

export const priceYieldColumnDefinition = <T extends { maturity: string }>(
    columnHelper: ColumnHelper<T>,
    title: string,
    id: string,
    accessor: AccessorFn<T, BigNumber>,
    variant: 'compact' | 'default' = 'default',
    type: Parameters<typeof PriceYieldItem>[0]['firstLineType'] = 'price',
    titleHint?: string
) => {
    return columnHelper.accessor(accessor, {
        id: id,
        cell: info => {
            return (
                <div className='flex justify-center'>
                    <PriceYieldItem
                        loanValue={LoanValue.fromPrice(
                            Number(info.getValue().toString()),
                            Number(info.row.original.maturity.toString())
                        )}
                        compact={variant === 'compact'}
                        firstLineType={type}
                    />
                </div>
            );
        },
        header: tableHeaderDefinition(title, titleHint),
    });
};

export const dateAndTimeColumnDefinition = <T extends { createdAt: BigNumber }>(
    columnHelper: ColumnHelper<T>,
    title: string,
    id: string,
    accessor: AccessorFn<T, BigNumber>,
    titleHint?: string
) => {
    return columnHelper.accessor(accessor, {
        id: id,
        cell: info => {
            return (
                <div className='typography-caption text-slateGray'>
                    {formatTimestamp(+info.getValue().toString())}
                </div>
            );
        },
        header: tableHeaderDefinition(title, titleHint),
    });
};
