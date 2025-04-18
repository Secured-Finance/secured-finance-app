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
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { ChartProps, Line } from 'react-chartjs-2';
import { Spinner } from 'src/components/atoms';
import {
    multiLineChartOptions as customOptions,
    defaultMultiLineChartDatasets,
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
    selectedTimeScales: {
        label: string;
        value: string;
    }[];
    isMaximised: boolean;
} & ChartProps;

export const MultiLineChart = ({
    data = { datasets: [], labels: [] },
    options = customOptions,
    style,
    maturityList,
    maturity,
    handleChartClick,
    selectedTimeScales,
    isMaximised,
}: MultiLineChartProps) => {
    const chartRef = useRef<ChartJS<'line'>>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);
    const [lastActiveTooltip, setLastActiveTooltip] = useState<{
        datasetIndex: number;
        index: number;
    } | null>(null);
    const [hasRunOnce, setHasRunOnce] = useState(false);
    const isHovering = useRef(false);
    const defaultIndex = useMemo(
        () =>
            maturityList.findIndex(
                element => element.maturity === maturity.toNumber()
            ),
        [maturityList, maturity]
    );

    const updateTooltip = (chart: ChartJS<'line'>, index: number) => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);

        setLastActiveTooltip({ datasetIndex: 0, index });

        chart.setActiveElements([{ datasetIndex: 0, index }]);
        chart.tooltip?.setActiveElements([{ datasetIndex: 0, index }], {
            x: 0,
            y: 0,
        });
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

    const refinedData = useMemo(() => {
        const refinedDatasets = data.datasets.map(set => ({
            borderCapStyle: 'round' as Scriptable<
                CanvasLineCap,
                ScriptableContext<'line'>
            >,
            ...defaultMultiLineChartDatasets,
            ...set,
        }));

        return {
            ...data,
            datasets: refinedDatasets,
        };
    }, [data]);

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
                    updateTooltip(chartRef.current, lastActiveTooltip.index);
                }
                handleChartClick(selectedMaturityIndex);
            }
        }
    };

    const onMouseOut = useCallback(() => {
        if (!chartRef.current) return;

        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        isHovering.current = false;
        timeoutRef.current = setTimeout(
            () => {
                if (chartRef.current && !isHovering.current) {
                    updateTooltip(chartRef.current, defaultIndex);
                    setLastActiveTooltip(null);
                }
            },
            hasRunOnce ? 3000 : 0
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [maturityList, maturity]);

    const onMouseMove = useCallback(
        (event: React.MouseEvent<HTMLCanvasElement>) => {
            if (!chartRef.current) return;

            isHovering.current = true;
            const elements = chartRef.current.getElementsAtEventForMode(
                event as unknown as Event,
                'nearest',
                { axis: 'x', intersect: false, includeInvisible: true },
                false
            );

            if (elements.length > 0) {
                const { index } = elements[0];
                if (lastActiveTooltip?.index !== index) {
                    updateTooltip(chartRef.current, index);
                }
            }
        },
        [lastActiveTooltip]
    );

    // Reset tooltip when dependencies change (like resizing or time scale changes)
    useEffect(() => {
        setTimeout(() => {
            if (!chartRef.current) return;
            setLastActiveTooltip(null);
            if (defaultIndex >= 0) {
                updateTooltip(chartRef.current, defaultIndex);
            }
        }, 50);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isMaximised, selectedTimeScales]);

    // Update chart data without animations
    useEffect(() => {
        if (chartRef.current) {
            chartRef.current.data = refinedData;
            chartRef.current.update('none');
        }
    }, [refinedData]);

    useEffect(() => {
        if (!hasRunOnce) {
            onMouseOut();
            setHasRunOnce(true);
        }
    }, [onMouseOut, hasRunOnce]);

    return (
        <>
            {data && data.datasets && data.datasets[0].data.length > 0 ? (
                <Line
                    style={style}
                    data={refinedData}
                    options={options as ChartOptions<'line'>}
                    ref={chartRef}
                    onClick={handleClick}
                    data-chromatic='ignore'
                    plugins={[crossHairPlugin]}
                    onMouseOut={onMouseOut}
                    onMouseMove={onMouseMove}
                />
            ) : (
                <div className='flex h-full w-full items-center justify-center'>
                    <Spinner />
                </div>
            )}
        </>
    );
};
