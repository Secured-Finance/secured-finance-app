import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    LinearScale,
    Tooltip,
} from 'chart.js';
import { useEffect, useRef } from 'react';
import { Bar } from 'react-chartjs-2';
import { Rate } from 'src/utils';
import { getData, options } from './constants';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip);

export default function BarChart({
    rates,
    maturityList,
}: {
    rates: Rate[][];
    maturityList: string[];
}) {
    const data = getData(rates, maturityList);
    const chartRef = useRef<ChartJS<'bar'>>(null);
    useEffect(() => {
        if (chartRef.current) {
            chartRef.current.data = data;
            chartRef.current.update('none');
        }
    }, [data]);

    return (
        <div className='h-full w-full'>
            <Bar ref={chartRef} data={data} options={options} />
        </div>
    );
}
