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
import React, { useEffect, useMemo, useRef } from 'react';
import { ChartProps, getElementAtEvent, Line } from 'react-chartjs-2';
import { useDispatch, useSelector } from 'react-redux';
import { Option } from 'src/components/atoms';
import {
    crossHairPlugin,
    defaultDatasets,
    getCurveGradient,
    options as customOptions,
} from 'src/components/molecules/LineChart/constants';
import { setMaturity } from 'src/store/landingOrderForm';
import { RootState } from 'src/store/types';

ChartJS.register(
    LinearScale,
    PointElement,
    LineElement,
    Title,
    CategoryScale,
    Tooltip,
    crossHairPlugin
);

function triggerHover(chart: ChartJS<'line'>, index: number) {
    chart.setActiveElements([
        {
            datasetIndex: 0,
            index: index,
        },
    ]);
    chart.update();
}

function triggerTooltip(chart: ChartJS<'line'>, index: number) {
    const tooltip = chart.tooltip;
    if (tooltip) {
        const chartArea = chart.chartArea;
        tooltip.setActiveElements(
            [
                {
                    datasetIndex: 0,
                    index: index,
                },
            ],
            {
                x: (chartArea.left + chartArea.right) / 2,
                y: (chartArea.top + chartArea.bottom) / 2,
            }
        );
    }
    chart.update();
}

export type LineChartProps = {
    style?: React.CSSProperties;
    data: ChartData<'line'>;
    maturitiesOptionList: Option[];
} & ChartProps;

export const LineChart = ({
    data = { datasets: [], labels: [] },
    options = customOptions,
    style,
    maturitiesOptionList,
}: LineChartProps) => {
    const dispatch = useDispatch();
    const ccy = useSelector(
        (state: RootState) => state.landingOrderForm.currency
    );
    const lendingContracts = useSelector(
        (state: RootState) => state.availableContracts.lendingMarkets[ccy]
    );
    const maturity = useSelector(
        (state: RootState) => state.landingOrderForm.maturity
    );

    const chartRef = useRef<ChartJS<'line'>>(null);

    const refinedDatasets = useMemo(
        () =>
            data.datasets.map(set => {
                if (defaultDatasets) {
                    return {
                        borderCapStyle: 'round' as Scriptable<
                            CanvasLineCap,
                            ScriptableContext<'line'>
                        >,
                        borderColor: (context: ScriptableContext<'line'>) =>
                            getCurveGradient(context),
                        ...defaultDatasets,
                        ...set,
                    };
                }
                return {
                    ...set,
                };
            }),
        [data.datasets]
    );

    const refinedData = {
        ...data,
        datasets: refinedDatasets,
    };

    const handleClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
        if (!chartRef.current) return;

        const element = getElementAtEvent(chartRef.current, event);
        if (element && element[0]) {
            const { index } = element[0];
            const label = data.labels?.[index];
            dispatch(setMaturity(lendingContracts[label as string]));
        }
    };

    useEffect(() => {
        if (!chartRef.current) return;

        if (chartRef.current) {
            const numberOfElements =
                chartRef.current.data.datasets[0].data.length;
            let index = maturitiesOptionList.findIndex(
                (element: Option) => element.value === maturity
            );
            if (numberOfElements) {
                index = index > 0 ? index : 0;
                triggerHover(chartRef.current, index);
                triggerTooltip(chartRef.current, index);
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [maturity]);

    return (
        <Line
            data-chromatic='ignore'
            style={style}
            data={refinedData}
            options={options}
            ref={chartRef}
            onClick={handleClick}
        />
    );
};
