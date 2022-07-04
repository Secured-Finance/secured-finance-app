import React, { useRef } from 'react';
import { ChartProps, Line } from 'react-chartjs-2';
import {
    defaultDatasets,
    options as customOptions,
} from '../../molecules/LineChart/constants';
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    CategoryScale,
    Tooltip,
    Scriptable,
    ChartData,
    ScriptableContext,
} from 'chart.js';

ChartJS.register(
    LinearScale,
    PointElement,
    LineElement,
    Title,
    CategoryScale,
    Tooltip
);

export type LineChartProps = {
    style?: React.CSSProperties;
    data: ChartData<'line'>;
} & ChartProps;

export const LineChart = ({
    data = { datasets: [], labels: [] },
    options = customOptions,
    style,
}: LineChartProps) => {
    const canvas: HTMLCanvasElement = document.createElement('canvas');
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d');

    const yieldCurveGradient = ctx.createLinearGradient(0, 0, 500, 0);
    yieldCurveGradient.addColorStop(0, 'rgba(255, 89, 248, 0)');
    yieldCurveGradient.addColorStop(0.2, 'rgba(174, 114, 255, 1)');
    yieldCurveGradient.addColorStop(0.5, 'rgba(144, 233, 237, 1)');
    yieldCurveGradient.addColorStop(0.78, 'rgba(92, 209, 103, 1)');
    yieldCurveGradient.addColorStop(1, 'rgba(255, 238, 0, 0)');

    const refinedDatasets = data.datasets.map(set => {
        if (defaultDatasets) {
            return {
                borderCapStyle: 'round' as Scriptable<
                    CanvasLineCap,
                    ScriptableContext<'line'>
                >,
                borderColor: yieldCurveGradient,
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

    const chartRef = useRef(null);

    return (
        <Line
            style={style}
            data={refinedData}
            options={options}
            ref={chartRef}
        />
    );
};
