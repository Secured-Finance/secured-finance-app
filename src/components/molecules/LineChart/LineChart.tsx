import {
    CategoryScale,
    Chart as ChartJS,
    ChartData,
    LinearScale,
    LineElement,
    PointElement,
    Scriptable,
    ScriptableContext,
    Title,
    Tooltip,
} from 'chart.js';
import React, { useRef } from 'react';
import { ChartProps, getElementAtEvent, Line } from 'react-chartjs-2';
import { useDispatch, useSelector } from 'react-redux';
import {
    defaultDatasets,
    options as customOptions,
} from 'src/components/molecules/LineChart/constants';
import { setRate, setTerm } from 'src/store/landingOrderForm';
import { RootState } from 'src/store/types';

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
    const dispatch = useDispatch();
    const ccy = useSelector(
        (state: RootState) => state.landingOrderForm.currency
    );
    const lendingContracts = useSelector(
        (state: RootState) => state.availableContracts.lendingMarkets[ccy]
    );

    const chartRef = useRef(null);

    const canvas: HTMLCanvasElement = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) return null;

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

    const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!chartRef.current) return;

        const element = getElementAtEvent(chartRef.current, event);
        if (element && element[0]) {
            const { datasetIndex, index } = element[0];
            const dataset = data.datasets[datasetIndex];
            const label = data.labels?.[index];

            dispatch(
                setTerm(lendingContracts[label as string].maturity.toString())
            );

            const value = dataset.data[index];
            dispatch(setRate(value as number));
        }
    };

    return (
        <Line
            style={style}
            data={refinedData}
            options={options}
            ref={chartRef}
            onClick={handleClick}
        />
    );
};
