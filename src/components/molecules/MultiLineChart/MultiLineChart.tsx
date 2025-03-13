import {
    CategoryScale,
    ChartData,
    Chart as ChartJS,
    ChartOptions,
    Filler,
    LineElement,
    LinearScale,
    PointElement,
    Scriptable,
    ScriptableContext,
    Title,
    Tooltip,
} from 'chart.js';
import ChartTooltip from 'chart.js/auto';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ChartProps, Line } from 'react-chartjs-2';
import { Spinner } from 'src/components/atoms';
import {
    options as customOptions,
    defaultDatasets,
} from 'src/components/molecules/MultiLineChart/constants';
import { MaturityListItem } from 'src/components/organisms';
import { Maturity } from 'src/utils/entities';
import { crossHairPlugin } from '../LineChart';

ChartJS.register(
    LinearScale,
    PointElement,
    LineElement,
    Title,
    CategoryScale,
    Tooltip,
    Filler
);

type MultiLineChartProps = {
    style?: React.CSSProperties;
    data: ChartData<'line'>;
    maturityList: MaturityListItem[];
    maturity: Maturity;
    handleChartClick: (index: number) => void;
} & ChartProps;

export const MultiLineChart = ({
    data = { datasets: [], labels: [] },
    options = customOptions,
    style,
    maturityList,
    maturity,
    handleChartClick,
}: MultiLineChartProps) => {
    const chartRef = useRef<ChartJS<'line'>>(null);

    const [lastActiveTooltip, setLastActiveTooltip] = useState<{
        datasetIndex: number;
        index: number;
    } | null>(null);

    const triggerHover = (chart: ChartJS<'line'>, index: number) => {
        setLastActiveTooltip({ datasetIndex: 0, index });

        chart.setActiveElements([
            {
                datasetIndex: 0,
                index: index,
            },
        ]);
        chart.update();
    };

    const triggerTooltip = (chart: ChartJS<'line'>, index: number) => {
        const tooltip = chart.tooltip as unknown as ChartTooltip<'line'>;
        setLastActiveTooltip({ datasetIndex: 0, index });

        if (tooltip) {
            tooltip.setActiveElements([
                {
                    datasetIndex: 0,
                    index: index,
                },
            ]);
            tooltip.update();
        }
        chart.update();
    };

    if (data.datasets.length > 0 && data.datasets[0].data.length > 0) {
        const dataArray = data.datasets[0].data as number[];

        if (dataArray.every(item => item === 0)) {
            options = {
                ...options,
                scales: {
                    ...options.scales,
                    y: {
                        display: false,
                        beginAtZero: true,
                    },
                },
            };
        }
    }

    const refinedDatasets = data.datasets.map(set => {
        if (defaultDatasets) {
            return {
                borderCapStyle: 'round' as Scriptable<
                    CanvasLineCap,
                    ScriptableContext<'line'>
                >,
                ...defaultDatasets,
                ...set,
            };
        }
        return {
            ...set,
        };
    });

    const refinedData = {
        ...data,
        datasets: refinedDatasets,
    };

    useEffect(() => {
        if (lastActiveTooltip) {
            const timeout = setTimeout(() => {
                setLastActiveTooltip(null);
            }, 5000);

            return () => clearTimeout(timeout);
        }
    }, [lastActiveTooltip]);

    const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!chartRef.current) return;

        const element = chartRef.current.getElementsAtEventForMode(
            event as unknown as Event,
            'nearest',
            { axis: 'x', intersect: false, includeInvisible: true },
            true
        );
        if (element && element[0]) {
            const { index } = element[0];
            const label = data.labels?.[index];
            const selectedMaturityIndex = maturityList.findIndex(
                element => element.label === label
            );
            if (selectedMaturityIndex >= 0) {
                if (lastActiveTooltip) {
                    triggerHover(chartRef.current, lastActiveTooltip.index);
                    triggerTooltip(chartRef.current, lastActiveTooltip.index);
                }
                handleChartClick(selectedMaturityIndex);
            }
        }
    };

    const onMouseOut = useCallback(() => {
        if (!chartRef.current) return;

        if (!lastActiveTooltip) {
            const numberOfElements =
                chartRef.current.data.datasets[0].data.length;
            let index = maturityList.findIndex(
                element => element.maturity === maturity.toNumber()
            );

            if (numberOfElements) {
                index = index > 0 ? index : 0;
                triggerHover(chartRef.current, index);
                triggerTooltip(chartRef.current, index);
            }
        }
    }, [maturityList, maturity, lastActiveTooltip]);

    useEffect(() => {
        onMouseOut();
    }, [onMouseOut]);

    return (
        <>
            {refinedData.datasets.length > 0 &&
            refinedData.datasets[0].data.length > 0 ? (
                <Line
                    style={style}
                    data={refinedData}
                    options={options as ChartOptions<'line'>}
                    ref={chartRef}
                    onClick={handleClick}
                    data-chromatic='ignore'
                    plugins={[crossHairPlugin]}
                    onMouseOut={onMouseOut}
                />
            ) : (
                <div className='flex h-full w-full items-center justify-center'>
                    <Spinner />
                </div>
            )}
        </>
    );
};
