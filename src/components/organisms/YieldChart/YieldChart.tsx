import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SFLogoSmall from 'src/assets/img/logo-small.svg';
import { ExpandIndicator, Option } from 'src/components/atoms';
import { CurveHeader, getData, LineChart } from 'src/components/molecules';
import { setMaturity } from 'src/store/landingOrderForm';
import { RootState } from 'src/store/types';
import { CurrencySymbol, Rate } from 'src/utils';

interface YieldChartProps {
    asset: CurrencySymbol;
    isBorrow: boolean;
    rates: Array<Rate>;
    maturitiesOptionList: Option[];
}

export const YieldChart = ({
    asset,
    isBorrow,
    rates,
    maturitiesOptionList,
}: YieldChartProps): JSX.Element => {
    const dispatch = useDispatch();
    const lendingContracts = useSelector(
        (state: RootState) => state.availableContracts.lendingMarkets[asset]
    );
    const [show, setShow] = useState(true);

    return (
        <div className='flex h-[480px] w-fit flex-row overflow-hidden rounded-r-xl border-y border-r border-panelStroke shadow-[0_46px_64px_rgba(0,0,0,0.4)]'>
            <div
                className={`flex flex-col items-start overflow-hidden transition-width duration-700 ease-out ${
                    show ? 'w-[640px] pl-8' : 'w-0'
                }`}
                data-testid='yield-chart-component'
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
                                maturitiesOptionList={maturitiesOptionList}
                                handleChartClick={maturity =>
                                    dispatch(setMaturity(maturity))
                                }
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
