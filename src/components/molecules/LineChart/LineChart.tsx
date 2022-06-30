import React, { useRef } from 'react';
import { ChartProps, Line } from 'react-chartjs-2';
import {
    commonDataset,
    defaultDatasets,
    options as customOptions,
} from '../../molecules/LineChart/constants';
import { ChartData } from 'chart.js';
import {
    Chart as ChartJS,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    CategoryScale,
    Tooltip,
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
    const refinedDatasets = data.datasets.map((set, i: number) => {
        if (defaultDatasets[i]) {
            return {
                borderCapStyle: 'round',
                ...defaultDatasets[i],
                ...set,
            };
        }
        return {
            ...commonDataset,
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
