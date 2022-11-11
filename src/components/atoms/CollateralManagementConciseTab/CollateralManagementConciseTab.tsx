import { Separator } from 'src/components/atoms/Separator';
import { percentFormat, usdFormat } from 'src/utils';

interface CollateralManagementConciseTabProps {
    collateralCoverage: number;
    totalCollateralInUSD: number;
    liquidationPercentage: number;
}

export const CollateralManagementConciseTab = ({
    collateralCoverage = 0,
    totalCollateralInUSD = 0,
    liquidationPercentage = 0,
}: CollateralManagementConciseTabProps) => {
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
                                liquidationPercentage
                            )}`}
                        </span>
                    </div>
                    <div className='typography-caption text-[#F9AA4B]'>
                        Medium
                    </div>
                </div>
                <div className='h-6px w-full rounded-full bg-gradient-to-r from-[rgba(48,224,161,1)] via-[rgba(247,147,26,1)] to-[rgba(250,34,86,1)]'></div>
            </div>
        </div>
    );
};
