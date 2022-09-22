import { ChartData } from 'chart.js';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import SFLogoSmall from 'src/assets/img/logo-small.svg';
import { ExpandIndicator } from 'src/components/atoms';
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
    const [show, setShow] = useState(true);

    return (
        <div className='flex h-[480px] w-fit flex-row overflow-hidden rounded-r-xl border-y border-r border-panelStroke shadow-[0_46px_64px_rgba(0,0,0,0.4)]'>
            <div
                className={`flex flex-col items-start overflow-hidden ${
                    show
                        ? 'w-[640px] pl-8 transition-[width] duration-700 ease-out'
                        : 'w-0 transition-[width] duration-700 ease-out'
                }`}
            >
                <div className='h-20'>
                    <CurveHeader
                        asset={asset}
                        isBorrow={isBorrow}
                    ></CurveHeader>
                </div>
                <div className='flex flex-grow items-center pl-[35px]'>
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
            <button
                className='relative flex w-10 items-center justify-center bg-starBlue-30'
                onClick={() => setShow(!show)}
            >
                <SFLogoSmall className='absolute top-2 h-8 w-8' />
                <div className='rotate-90'>
                    <ExpandIndicator expanded={!show} />
                </div>
            </button>
        </div>
    );
};
