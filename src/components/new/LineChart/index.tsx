import React, { useEffect, useRef } from 'react';
import cm from './LineChart.module.scss';
import { Line, ChartComponentProps } from 'react-chartjs-2';
import { defaultDatasets, commonDataset } from './constants';
import { options } from './constants';

export interface ILineChart extends ChartComponentProps {
    title?: string | JSX.Element;
    style?: React.CSSProperties;
    showLegend?: boolean;
}

export const LineChart: React.FC<ILineChart> = ({
    data,
    options,
    title,
    style,
    showLegend,
}) => {
    const refinedDatasets = data.datasets.map((set: any, i: number) => {
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

LineChart.defaultProps = {
    data: {
        datasets: [],
    },
    options,
};
