import { createColumnHelper } from '@tanstack/react-table';
import {
    ArcElement,
    Chart as ChartJS,
    ChartOptions,
    ChartTypeRegistry,
    Tooltip,
    TooltipItem,
} from 'chart.js';
import { useMemo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import { CurrencyIcon, GradientBox } from 'src/components/atoms';
import { CoreTable } from 'src/components/molecules';
import {
    CurrencySymbol,
    currencyMap,
    formatTimestamp,
    percentFormat,
    usdFormat,
} from 'src/utils';
ChartJS.register(ArcElement, Tooltip);

export type CollateralSnapshot = {
    currency: CurrencySymbol;
    ratio: number;
    price: number;
};

const columnHelper = createColumnHelper<CollateralSnapshot>();

const options: ChartOptions<'doughnut'> = {
    elements: {
        arc: {
            borderWidth: 0,
        },
    },
    plugins: {
        legend: {
            display: false,
        },
        tooltip: {
            yAlign: 'bottom',
            caretPadding: 16,
            backgroundColor: 'rgba(47, 50, 65, 1)',
            borderWidth: 1,
            borderColor: 'rgba(52, 56, 76, 1)',
            displayColors: false,
            cornerRadius: 10,
            padding: 8,
            callbacks: {
                label: (item: TooltipItem<keyof ChartTypeRegistry>) => {
                    let content = '';
                    content += item.formattedValue + '%';
                    return content;
                },
                title: () => {
                    return '';
                },
            },
        },
    },
};

export const CollateralSnapshot = ({
    data,
    snapshotDate,
}: {
    data: CollateralSnapshot[];
    snapshotDate: number | undefined;
}) => {
    const chartData = {
        labels: data.map(item => item.currency),
        datasets: [
            {
                data: data.map(item => item.ratio / 100),
                backgroundColor: data.map(
                    item => currencyMap[item.currency].chartColor
                ),
            },
        ],
    };

    const columns = useMemo(
        () => [
            columnHelper.accessor('currency', {
                cell: info => (
                    <div className='flex flex-row items-center gap-2'>
                        <CurrencyIcon ccy={info.getValue()} />
                        <span>{info.getValue()}</span>
                    </div>
                ),
                header: 'Asset',
            }),
            columnHelper.accessor('ratio', {
                cell: info => percentFormat(info.getValue() / 100),
                header: 'Ratio of Collateral',
            }),
            columnHelper.accessor('price', {
                cell: info => (
                    <div className='text-right'>
                        {usdFormat(info.getValue(), 2)}
                    </div>
                ),
                header: 'Snapshot Rate',
            }),
        ],
        []
    );

    return (
        <GradientBox
            header='Protocol Collateral Snapshot'
            shape='rounded-bottom'
        >
            <div className='grid min-w-fit grid-flow-row place-items-center space-y-6 p-2'>
                <section className='w-48 pt-7'>
                    <Doughnut data={chartData} options={options} />
                </section>
                <section className='typography-caption bg-black-20 px-4 pb-4'>
                    <CoreTable
                        columns={columns}
                        data={[
                            ...data.sort(
                                (a, b) =>
                                    currencyMap[a.currency].index -
                                    currencyMap[b.currency].index
                            ),
                        ]}
                        options={{
                            stickyHeader: false,
                        }}
                    />
                </section>
                <section className='typography-caption-2 text-center leading-6 text-slateGray'>
                    {`Snapshot as of ${formatTimestamp(snapshotDate ?? 0)}`}
                </section>
            </div>
        </GradientBox>
    );
};
