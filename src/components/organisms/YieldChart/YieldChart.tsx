import { ChartData } from 'chart.js';
import { CurveHeader, LineChart } from 'src/components/molecules';
import { CurrencySymbol, getTermsAsOptions } from 'src/utils';

interface YieldChartProps {
    asset: CurrencySymbol;
    isBorrow: boolean;
    rates: Array<number>;
}

const refineArray = (array: Array<number>) => {
    if (array.length > 0) {
        const newArray = array.slice();
        newArray.unshift(0);
        return newArray.map((r: number) => +r / 100);
    }

    return array;
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
        <div className='flex h-[480px] w-[640px] flex-col items-start rounded-r-xl pl-8 shadow-[0_46px_64px_rgba(0,0,0,0.4)]'>
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
