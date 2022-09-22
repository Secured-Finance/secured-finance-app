import { ChartData } from 'chart.js';
import { useSelector } from 'react-redux';
import { CurveHeader, LineChart } from 'src/components/molecules';
import { RootState } from 'src/store/types';
import { CurrencySymbol, Rate } from 'src/utils';

interface YieldChartProps {
    asset: CurrencySymbol;
    isBorrow: boolean;
    rates: Array<Rate>;
}

const refineArray = (array: Array<Rate>) => {
    return array.map(r => r.toNormalizedNumber());
};

const getData = (
    rates: Rate[],
    label: string,
    labels: string[]
): ChartData<'line'> => {
    return {
        labels: labels,
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
    const lendingContracts = useSelector(
        (state: RootState) => state.availableContracts.lendingMarkets[asset]
    );
    return (
        <div className='flex h-[480px] w-[640px] flex-col items-start rounded-r-xl border-y border-r border-panelStroke pl-8 shadow-[0_46px_64px_rgba(0,0,0,0.4)]'>
            <div className='h-20 w-full'>
                <CurveHeader asset={asset} isBorrow={isBorrow}></CurveHeader>
            </div>
            <div className='flex w-full flex-grow items-center pl-[35px]'>
                <div className='h-[350px] w-[500px]'>
                    {rates && (
                        <LineChart
                            type='line'
                            data={getData(
                                rates,
                                isBorrow ? 'Borrow' : 'Lend',
                                Object.keys(lendingContracts)
                            )}
                        ></LineChart>
                    )}
                </div>
            </div>
        </div>
    );
};
