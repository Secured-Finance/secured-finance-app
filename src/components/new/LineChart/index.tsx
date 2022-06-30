import React, { useRef } from 'react';
import { ChartProps, Line } from 'react-chartjs-2';
import {
    commonDataset,
    defaultDatasets,
    options as customOptions,
} from './constants';
import cm from './LineChart.module.scss';
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
    title?: string | JSX.Element;
    style?: React.CSSProperties;
    showLegend?: boolean;
    data: ChartData<'line'>;
} & ChartProps;

export const LineChart = ({
    data = { datasets: [], labels: [] },
    options = customOptions,
    title,
    style,
    showLegend,
}: LineChartProps) => {
    const refinedDatasets = data.datasets.map((set, i: number) => {
        if (defaultDatasets[i]) {
            return {
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
        <div className={cm.container} style={style}>
            {title && <span className={cm.title}>{title}</span>}
            <div className={cm.chartView}>
                <Line data={refinedData} options={options} ref={chartRef} />
                {showLegend && <div id={'legend'} className={cm.legend} />}
            </div>
        </div>
    );
};
