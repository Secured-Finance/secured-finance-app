/* eslint-disable react/display-name */
import { OrderSide } from '@secured-finance/sf-client';
import {
    AccessorFn,
    ColumnHelper,
    HeaderContext,
    Row,
} from '@tanstack/react-table';
import clsx from 'clsx';
import {
    Chip,
    ChipColors,
    CurrencyItem,
    PriceYieldItem,
} from 'src/components/atoms';
import { TableContractCell, TableHeader } from 'src/components/molecules';
import { Alignment, AssetPriceMap, ColorFormat } from 'src/types';
import { ZERO_BI, formatTimestamp } from 'src/utils';
import {
    CurrencySymbol,
    currencyMap,
    hexToCurrencySymbol,
} from './currencyList';
import { LoanValue, Maturity } from './entities';

export const tableHeaderDefinition =
    <TData,>(title: string, titleHint?: string, align: Alignment = 'center') =>
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (header: HeaderContext<TData, any>) =>
        (
            <TableHeader
                title={title}
                titleHint={titleHint}
                sortingHandler={header.column.getToggleSortingHandler()}
                isSorted={header.column.getIsSorted()}
                align={align}
            />
        );

type CurrencyProperty = {
    currency: string;
};
type SideProperty = {
    side: number;
};
type AmountProperty = {
    amount: bigint;
};
type InputAmountProperty = {
    inputAmount: bigint;
};
type FilledAmountProperty = {
    filledAmount: bigint;
};
type TypeProperty = {
    type: string;
};
type StatusProperty = {
    status: string;
};

type ForwardValueProperty = {
    forwardValue: bigint;
};

type AmountColumnType = (AmountProperty | SideProperty | ForwardValueProperty) &
    CurrencyProperty & { underMinimalCollateral?: boolean };

type InputAmountColumnType = InputAmountProperty &
    FilledAmountProperty &
    CurrencyProperty &
    SideProperty &
    TypeProperty &
    StatusProperty;

function hasAmountProperty<T extends AmountColumnType>(
    obj: T
): obj is T & AmountProperty {
    return (obj as AmountProperty).amount !== undefined;
}

function hasForwardValueProperty<T extends AmountColumnType>(
    obj: T
): obj is T & ForwardValueProperty {
    return (obj as ForwardValueProperty).forwardValue !== undefined;
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
    accessor: AccessorFn<T, bigint | undefined>,
    options: {
        color: boolean;
        compact: boolean;
        priceList?: AssetPriceMap;
        fontSize?: string;
        showCurrency?: boolean;
    },
    titleHint?: string,
    align: Alignment = 'center'
) => {
    return columnHelper.accessor(accessor, {
        id: id,
        cell: info => {
            const value = info.getValue();
            if (value === undefined) {
                return null;
            }
            const ccy = hexToCurrencySymbol(info.row.original.currency);
            if (!ccy) return null;

            let color: ColorFormat['color'];
            if (hasSideProperty(info.row.original)) {
                color = info.row.original.side === 1 ? 'negative' : 'positive';
            } else if (hasAmountProperty(info.row.original)) {
                color = info.row.original.amount < 0 ? 'negative' : 'positive';
            } else {
                // do nothing
            }

            const amount = currencyMap[ccy].fromBaseUnit(value as bigint);

            const Component = (
                <div className='flex items-start justify-end gap-2'>
                    <CurrencyItem
                        amount={amount}
                        ccy={ccy}
                        align='right'
                        price={options.priceList?.[ccy]}
                        color={options.color ? color : undefined}
                        compact={options.compact}
                        fontSize={options.fontSize}
                        minDecimals={currencyMap[ccy].roundingDecimal}
                        maxDecimals={currencyMap[ccy].roundingDecimal}
                        showCurrency={options.showCurrency}
                        warning={
                            info.row.original.underMinimalCollateral
                                ? 'Under Minimum Collateral Threshold'
                                : undefined
                        }
                    />
                </div>
            );
            if (align !== 'right') {
                return (
                    <div className='flex w-full items-center justify-end whitespace-nowrap pr-[15%]'>
                        {Component}
                    </div>
                );
            }

            return <>{Component}</>;
        },
        header: tableHeaderDefinition(title, titleHint, align),
    });
};

export const inputAmountColumnDefinition = <T extends InputAmountColumnType>(
    columnHelper: ColumnHelper<T>,
    title: string,
    id: string,
    accessor: AccessorFn<T, bigint>,
    options: {
        color: boolean;
        compact: boolean;
        priceList?: AssetPriceMap;
        fontSize?: string;
    },
    titleHint?: string
) => {
    return columnHelper.accessor(accessor, {
        id: id,
        cell: info => {
            const ccy = hexToCurrencySymbol(info.row.original.currency);
            if (!ccy) return null;

            const color: ColorFormat['color'] =
                info.row.original.side === 1 ? 'negative' : 'positive';

            const inputAmount =
                info.row.original.type === 'Market' &&
                info.row.original.status === 'Filled'
                    ? info.row.original.filledAmount
                    : info.row.original.inputAmount;

            return (
                <div className='flex w-full items-center justify-end whitespace-nowrap pr-[15%]'>
                    <div className='flex justify-end'>
                        <CurrencyItem
                            amount={currencyMap[ccy].fromBaseUnit(inputAmount)}
                            ccy={ccy}
                            align='right'
                            price={options.priceList?.[ccy]}
                            color={options.color ? color : undefined}
                            compact={options.compact}
                            fontSize={options.fontSize}
                            minDecimals={currencyMap[ccy].roundingDecimal}
                            maxDecimals={currencyMap[ccy].roundingDecimal}
                        />
                    </div>
                </div>
            );
        },
        header: tableHeaderDefinition(title, titleHint),
    });
};

export const forwardValueColumnDefinition = <T extends AmountColumnType>(
    columnHelper: ColumnHelper<T>,
    title: string,
    id: string,
    accessor: AccessorFn<T, bigint>,
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
            } else if (hasForwardValueProperty(info.row.original)) {
                color =
                    info.row.original.forwardValue < 0
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
                                info.getValue() as bigint
                            )}
                            ccy={ccy}
                            align='right'
                            price={options.priceList?.[ccy]}
                            color={options.color ? color : undefined}
                            compact={options.compact}
                            minDecimals={currencyMap[ccy].roundingDecimal}
                            maxDecimals={currencyMap[ccy].roundingDecimal}
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
                        color={
                            value.toString() === '1'
                                ? ChipColors.Red
                                : ChipColors.Green
                        }
                        label={value.toString() === '1' ? 'Borrow' : 'Lend'}
                    />
                </div>
            );
        },
        header: tableHeaderDefinition(title),
    });
};

export const loanTypeFromFVColumnDefinition = <T extends ForwardValueProperty>(
    columnHelper: ColumnHelper<T>,
    title: string,
    id: string
) => {
    const assessorFn: AccessorFn<T, bigint> = row => row.forwardValue;

    return columnHelper.accessor(assessorFn, {
        id: id,
        cell: info => {
            if (info.getValue() === ZERO_BI) return null;
            return (
                <div className='flex justify-center'>
                    <Chip
                        color={
                            info.getValue() < 0
                                ? ChipColors.Red
                                : ChipColors.Green
                        }
                        label={info.getValue() < 0 ? 'Borrow' : 'Lend'}
                    />
                </div>
            );
        },
        header: tableHeaderDefinition(title),
    });
};

export const contractColumnDefinition = <
    T extends {
        maturity: string | number;
        currency: string;
        forwardValue?: bigint;
    }
>(
    columnHelper: ColumnHelper<T>,
    title: string,
    id: string,
    variant:
        | 'compact'
        | 'default'
        | 'contractOnly'
        | 'currencyOnly' = 'default',
    delistedCurrencySet?: Set<CurrencySymbol>,
    alignCell: Alignment = 'center',
    alignHeader: Alignment = 'center',
    titleHint?: string
) => {
    const assessorFn: AccessorFn<T, string> = row => row.maturity.toString();
    return columnHelper.accessor(assessorFn, {
        id: id,
        cell: info => {
            const currency = hexToCurrencySymbol(info.row.original.currency);
            const delisted =
                currency && delistedCurrencySet
                    ? delistedCurrencySet.has(currency)
                    : false;
            const side =
                BigInt(info.row.original.forwardValue ?? 0) < 0
                    ? OrderSide.BORROW
                    : OrderSide.LEND;
            return (
                <div
                    className={clsx('flex px-3', {
                        'justify-start': alignCell === 'left',
                        'justify-center': alignCell === 'center',
                        'justify-end': alignCell === 'right',
                    })}
                >
                    <TableContractCell
                        maturity={new Maturity(info.getValue())}
                        ccyByte32={info.row.original.currency}
                        variant={variant}
                        delistedContractSide={delisted ? side : undefined}
                    />
                </div>
            );
        },
        header: tableHeaderDefinition(title, titleHint, alignHeader),
        sortingFn: contractSortingFn,
    });
};

export const withdrawableAssetColumnDefinition = <
    T extends {
        maturity: string | number;
        currency: string;
        type: 'position' | 'collateral' | 'lending-order';
    }
>(
    columnHelper: ColumnHelper<T>,
    title: string,
    id: string
) => {
    const assessorFn: AccessorFn<T, string> = row => row.maturity.toString();
    return columnHelper.accessor(assessorFn, {
        id: id,
        cell: info => {
            const variant =
                info.row.original.type === 'position'
                    ? 'default'
                    : 'compactCurrencyOnly';
            return (
                <div className='flex justify-start'>
                    <TableContractCell
                        maturity={new Maturity(info.getValue())}
                        ccyByte32={info.row.original.currency}
                        variant={variant}
                    />
                </div>
            );
        },
        header: tableHeaderDefinition(title, undefined, 'left'),
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

export const priceYieldColumnDefinition = <
    T extends { maturity: string; calculationDate?: number }
>(
    columnHelper: ColumnHelper<T>,
    title: string,
    id: string,
    accessor: AccessorFn<T, bigint>,
    variant: 'compact' | 'default' = 'default',
    type: Parameters<typeof PriceYieldItem>[0]['firstLineType'] = 'price',
    titleHint?: string
) => {
    return columnHelper.accessor(accessor, {
        id: id,
        cell: info => {
            const calculationDate = info.row.original.calculationDate;
            return (
                <div className='flex justify-center'>
                    <PriceYieldItem
                        loanValue={LoanValue.fromPrice(
                            Number(info.getValue().toString()),
                            Number(info.row.original.maturity.toString()),
                            calculationDate
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

export const inputPriceYieldColumnDefinition = <T extends { maturity: string }>(
    columnHelper: ColumnHelper<T>,
    title: string,
    id: string,
    accessor: AccessorFn<T, bigint>
) => {
    return columnHelper.accessor(accessor, {
        id: id,
        cell: info => {
            return (
                <div className='flex justify-center'>
                    {Number(info.getValue().toString()) === 0 ? (
                        <div className='typography-caption'>Market Price</div>
                    ) : (
                        <PriceYieldItem
                            loanValue={LoanValue.fromPrice(
                                Number(info.getValue().toString()),
                                Number(info.row.original.maturity.toString())
                            )}
                            firstLineType='price'
                        />
                    )}
                </div>
            );
        },
        header: tableHeaderDefinition(title),
    });
};

export const dateAndTimeColumnDefinition = <T extends { createdAt: bigint }>(
    columnHelper: ColumnHelper<T>,
    title: string,
    id: string,
    accessor: AccessorFn<T, bigint>,
    fontSize?: string,
    titleHint?: string
) => {
    return columnHelper.accessor(accessor, {
        id: id,
        cell: info => {
            return (
                <div className='flex justify-center'>
                    <div className='flex flex-col text-right'>
                        <span
                            className={clsx(
                                fontSize ? fontSize : 'typography-caption-2',
                                'h-6 text-slateGray'
                            )}
                        >
                            {formatTimestamp(+info.getValue().toString())}
                        </span>
                    </div>
                </div>
            );
        },
        header: tableHeaderDefinition(title, titleHint),
    });
};
