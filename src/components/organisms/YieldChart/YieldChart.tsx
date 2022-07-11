import { ChartData } from 'chart.js';
import { CurveHeader, LineChart } from 'src/components/molecules';
import { Currency, getTermsAsOptions } from 'src/utils';

interface YieldChartProps {
    asset: Currency;
    isBorrow: boolean;
    rates: Array<number>;
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
        labels: getTermsAsOptions().map(o => o.label),
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
    rates,
}): JSX.Element => {
    return (
        <div className='flex h-[536px] w-[585px] flex-col items-start shadow-xl drop-shadow-2xl'>
            <div className='h-20 w-full'>
                <CurveHeader asset={asset} isBorrow={isBorrow}></CurveHeader>
            </div>
            <div className='flex w-full flex-grow items-center pl-[35px]'>
                <div className='h-[350px] w-[500px]'>
                    {rates && (
                        <LineChart
                            type='line'
                            data={getData(rates, isBorrow ? 'Borrow' : 'Lend')}
                        ></LineChart>
                    )}
                </div>
            </div>
        </div>
    );
};
