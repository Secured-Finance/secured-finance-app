import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import SFLogoSmall from 'src/assets/img/logo-small.svg';
import { ExpandIndicator } from 'src/components/atoms';
import { CurveHeader, LineChart, getData } from 'src/components/molecules';
import {
    selectLandingOrderForm,
    setMaturity,
} from 'src/store/landingOrderForm';
import { RootState } from 'src/store/types';
import { DailyVolumes, MaturityOptionList } from 'src/types';
import { CurrencySymbol, Rate } from 'src/utils';
import { Maturity } from 'src/utils/entities';

interface YieldChartProps {
    asset: CurrencySymbol;
    isBorrow: boolean;
    rates: Array<Rate>;
    maturitiesOptionList: MaturityOptionList;
    dailyVolumes: DailyVolumes;
}

export const YieldChart = ({
    asset,
    isBorrow,
    rates,
    maturitiesOptionList,
    dailyVolumes,
}: YieldChartProps): JSX.Element => {
    const dispatch = useDispatch();

    const { maturity } = useSelector((state: RootState) =>
        selectLandingOrderForm(state.landingOrderForm)
    );
    const [show, setShow] = useState(true);

    return (
        <div className='hidden h-[480px] w-fit flex-row overflow-hidden rounded-r-xl border-y border-r border-panelStroke shadow-[0_46px_64px_rgba(0,0,0,0.4)] tablet:visible tablet:flex'>
            <div
                className={`flex flex-col items-start overflow-hidden transition-width duration-700 ease-out ${
                    show ? 'w-[640px] pl-8' : 'w-0'
                }`}
                data-testid='yield-chart-component'
            >
                <div className='h-20'>
                    <CurveHeader
                        asset={asset}
                        dailyVolumes={dailyVolumes}
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
                                    maturitiesOptionList.map(o => o.label)
                                )}
                                maturitiesOptionList={maturitiesOptionList}
                                handleChartClick={maturity =>
                                    dispatch(setMaturity(maturity.toNumber()))
                                }
                                maturity={new Maturity(maturity)}
                            />
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
