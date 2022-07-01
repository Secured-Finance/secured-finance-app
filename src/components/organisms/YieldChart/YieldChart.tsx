import { CurveHeader } from 'src/components/molecules/CurveHeader';
import { LineChart } from 'src/components/molecules/LineChart';
import { ChartData } from 'chart.js';
import { useRates } from 'src/hooks/useRates';

interface YieldChartProps {
    asset: string;
    isBorrow: boolean;
}

const refineArray = (array: Array<number>) => {
    if (!array.length) return array;

    if (array.length > 0) {
        const newArray = array.slice();
        newArray.unshift(0);
        return newArray.map((r: number) => +r / 100);
    }
};

const getData = (rates: number[], label: string): ChartData<'line'> => {
    return {
        labels: [
            'SEP22',
            'DEC22',
            'MAR23',
            'JUN23',
            'SEP23',
            'DEC23',
            'MAR24',
            'JUN24',
        ],
        datasets: [
            {
                label: label,
                data: refineArray(rates),
            },
        ],
    };
};

export const YieldChart: React.FC<YieldChartProps> = ({
    asset,
    isBorrow,
}): JSX.Element => {
    const borrowRates = useRates('FIL', 0);
    const lendingRates = useRates('FIL', 1);

    return (
        <div className='flex h-[536px] w-[585px] flex-col items-start'>
            <div className='h-20 w-full'>
                <CurveHeader asset={asset} isBorrow={isBorrow}></CurveHeader>
            </div>
            <div className='flex w-full flex-grow items-center pl-[35px]'>
                <div className='h-[350px] w-[500px]'>
                    <LineChart
                        type='line'
                        data={
                            isBorrow
                                ? getData(borrowRates, 'Borrow')
                                : getData(lendingRates, 'Lend')
                        }
                    ></LineChart>
                </div>
            </div>
        </div>
    );
};
