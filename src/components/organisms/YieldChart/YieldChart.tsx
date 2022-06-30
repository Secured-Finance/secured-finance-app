import { CurveHeader } from 'src/components/molecules/CurveHeader';
import { LineChart } from 'src/components/molecules/LineChart';
import { ChartData } from 'chart.js';

interface YieldChartProps {
    asset: string;
    isBorrow: boolean;
}

const data: ChartData<'line'> = {
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
            label: 'Borrow',
            data: [50, 34, 27.37, 22.29, 18, 14.22, 10.81, 8.2],
        },
    ],
};

export const YieldChart: React.FC<YieldChartProps> = ({
    asset,
    isBorrow,
}): JSX.Element => {
    return (
        <div className='flex h-[536px] w-[585px] flex-col items-start'>
            <div className='h-20 w-full'>
                <CurveHeader asset={asset} isBorrow={isBorrow}></CurveHeader>
            </div>
            <div className='flex w-full flex-grow pl-[35px] pt-[100px]'>
                <div className='w-[500px]'>
                    <LineChart type='line' data={data}></LineChart>
                </div>
            </div>
        </div>
    );
};
