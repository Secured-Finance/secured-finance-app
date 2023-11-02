import { useState } from 'react';
import SFLogoSmall from 'src/assets/img/logo-small.svg';
import { ExpandIndicator } from 'src/components/atoms';
import { CurveHeader } from 'src/components/molecules';
import { LineChartTab } from 'src/components/organisms';
import { useYieldCurveMarketRates } from 'src/hooks';
import { DailyVolumes } from 'src/types';
import { CurrencySymbol } from 'src/utils';

interface YieldChartProps {
    asset: CurrencySymbol;
    dailyVolumes: DailyVolumes;
}

export const YieldChart = ({
    asset,
    dailyVolumes,
}: YieldChartProps): JSX.Element => {
    const [show, setShow] = useState(true);

    const {
        rates,
        maturityList,
        itayoseMarketIndexSet,
        maximumRate,
        marketCloseToMaturityOriginalRate,
    } = useYieldCurveMarketRates();

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
                <div className='flex w-full flex-grow items-center pl-[35px]'>
                    <div className='h-[350px] w-[550px]'>
                        <LineChartTab
                            rates={rates}
                            maturityList={maturityList}
                            itayoseMarketIndexSet={itayoseMarketIndexSet}
                            followLinks={false}
                            maximumRate={maximumRate}
                            marketCloseToMaturityOriginalRate={
                                marketCloseToMaturityOriginalRate
                            }
                        />
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
