import { Separator } from 'src/components/atoms/Separator';
import { LIQUIDATION_THRESHOLD, percentFormat, usdFormat } from 'src/utils';

interface CollateralManagementConciseTabProps {
    collateralCoverage: number;
    totalCollateralInUSD: number;
}

export const CollateralManagementConciseTab = ({
    collateralCoverage,
    totalCollateralInUSD,
}: CollateralManagementConciseTabProps) => {
    const info = getLiquidationInformation(collateralCoverage);

    return (
        <div className='flex h-fit w-full flex-col bg-black-20 pt-2 pb-4'>
            <div className='mx-4 mb-5 mt-4 flex flex-col gap-3'>
                <div className='flex flex-row items-center justify-between'>
                    <div className='flex flex-col gap-[2px]'>
                        <span className='typography-caption text-grayScale'>
                            Collateral
                        </span>
                        <span className='typography-caption-3 text-slateGray'>
                            {`Utilization ${percentFormat(collateralCoverage)}`}
                        </span>
                    </div>
                    <div className='typography-caption text-grayScale'>
                        {usdFormat(
                            (collateralCoverage * totalCollateralInUSD) / 100.0
                        )}
                    </div>
                </div>
                <div className='h-6px w-full overflow-hidden rounded-full bg-[#2A313C]'>
                    <div
                        className='h-full rounded-full bg-purple transition-width duration-700 ease-in'
                        style={{
                            width: `calc(100% * ${collateralCoverage / 100.0})`,
                        }}
                        data-testid='collateral-progress-bar-track'
                    ></div>
                </div>
            </div>
            <Separator color='neutral-3' />
            <div className='mx-4 mb-4 mt-5 flex flex-col gap-3'>
                <div className='flex flex-row items-center justify-between'>
                    <div className='flex flex-col gap-[2px]'>
                        <span className='typography-caption text-grayScale'>
                            Liquidation Risk
                        </span>
                        <span className='typography-caption-3 text-slateGray'>
                            {`Threshold ${percentFormat(
                                LIQUIDATION_THRESHOLD > collateralCoverage
                                    ? LIQUIDATION_THRESHOLD - collateralCoverage
                                    : 0
                            )}`}
                        </span>
                    </div>
                    <div className={`typography-caption ${info.color}`}>
                        {info.risk}
                    </div>
                </div>
                <div className='h-6px w-full rounded-full bg-gradient-to-r from-progressBarStart via-progressBarVia to-progressBarEnd'></div>
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
