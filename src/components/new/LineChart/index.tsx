import * as chartjs from 'chart.js';
import React, { useEffect, useRef } from 'react';
import { ChartComponentProps, Line } from 'react-chartjs-2';
import {
    commonDataset,
    defaultDatasets,
    options as customOptions,
} from './constants';
import cm from './LineChart.module.scss';

export type LineChartProps = {
    title?: string | JSX.Element;
    style?: React.CSSProperties;
    showLegend?: boolean;
    data: chartjs.ChartData;
} & ChartComponentProps;

export const LineChart = ({
    data = { datasets: [] },
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
    useEffect(() => {
        if (showLegend && data.datasets.length) {
            document.getElementById('legend').innerHTML =
                chartRef.current.chartInstance.generateLegend();
        }
    }, [showLegend, data.datasets.length]);

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
