import Tick from 'src/assets/icons/tick.svg';
import { Separator } from 'src/components/atoms/Separator';
import { LIQUIDATION_THRESHOLD, percentFormat, usdFormat } from 'src/utils';
import { computeAvailableToBorrow } from 'src/utils/collateral';

interface CollateralManagementConciseTabProps {
    collateralCoverage: number;
    totalCollateralInUSD: number;
}

export const CollateralManagementConciseTab = ({
    collateralCoverage,
    totalCollateralInUSD,
}: CollateralManagementConciseTabProps) => {
    let padding = collateralCoverage / 100.0;
    if (padding > 1) {
        padding = 1;
    }
    const info = getLiquidationInformation(collateralCoverage);
    const availableToBorrow = computeAvailableToBorrow(
        1,
        totalCollateralInUSD,
        collateralCoverage / 100.0
    );

    return (
        <div className='flex h-fit w-full flex-col rounded-b bg-black-20 pt-2 pb-4'>
            <div className='mx-4 mb-5 mt-4 flex flex-col'>
                <div className='typography-caption mb-3 flex flex-row justify-between text-grayScale'>
                    <span>Collateral Utilization</span>
                    <span>{percentFormat(collateralCoverage, 100)}</span>
                </div>
                <div className='h-6px w-full overflow-hidden rounded-full bg-[#2A313C]'>
                    <div
                        className='h-full rounded-full bg-nebulaTeal transition-width duration-700 ease-in'
                        style={{
                            width: `calc(100% * ${padding})`,
                        }}
                        data-testid='collateral-progress-bar-track'
                    ></div>
                </div>
                <div className='typography-caption-2 mt-1 leading-6 text-planetaryPurple'>
                    {`Available: ${usdFormat(availableToBorrow, 2)}`}
                </div>
            </div>
            <Separator color='neutral-3' />
            <div className='mx-4 mb-4 mt-5 flex flex-col'>
                <div className='typography-caption mb-1 flex flex-row justify-between'>
                    <span className='text-grayScale'>Liquidation Risk</span>
                    <span className={`${info.color}`}>{info.risk}</span>
                </div>
                <div
                    style={{
                        width: `calc(100% * ${padding} + 4px )`,
                    }}
                    className='transition-width duration-700 ease-in'
                    data-testid='liquidation-progress-bar-tick'
                >
                    <Tick className='float-right h-5px w-2'></Tick>
                </div>
                <div className='mt-2 h-6px w-full rounded-full bg-gradient-to-r from-progressBarStart via-progressBarVia to-progressBarEnd'></div>
                <div className='typography-caption-2 mt-1 leading-6 text-planetaryPurple'>
                    {`Threshold: ${percentFormat(
                        LIQUIDATION_THRESHOLD > collateralCoverage
                            ? LIQUIDATION_THRESHOLD - collateralCoverage
                            : 0
                    )}`}
                </div>
            </div>
        </div>
    );
};

export const getLiquidationInformation = (liquidationPercentage: number) => {
    if (liquidationPercentage === 0) {
        return { color: 'text-white', risk: 'N/A' };
    } else if (liquidationPercentage < 40) {
        return { color: 'text-progressBarStart', risk: 'Low' };
    } else if (liquidationPercentage >= 40 && liquidationPercentage < 60) {
        return { color: 'text-progressBarVia', risk: 'Medium' };
    } else if (liquidationPercentage >= 60 && liquidationPercentage < 80) {
        return { color: 'text-progressBarEnd', risk: 'High' };
    }
    return { color: 'text-progressBarEnd', risk: 'Liquidated' };
};
