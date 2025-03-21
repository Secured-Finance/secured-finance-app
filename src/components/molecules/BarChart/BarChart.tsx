import {
    BarElement,
    CategoryScale,
    Chart as ChartJS,
    LinearScale,
    Tooltip,
} from 'chart.js';
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

    return (
        <div className='h-full w-full'>
            <Bar data={data} options={options} />
        </div>
    );
}
