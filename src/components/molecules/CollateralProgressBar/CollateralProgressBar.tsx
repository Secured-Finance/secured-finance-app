import Tick from 'src/assets/icons/tick.svg';
import { InformationPopover } from 'src/components/atoms';
import { percentFormat, usdFormat } from 'src/utils';
import { computeAvailableToBorrow } from 'src/utils/collateral';

interface CollateralProgressBarProps {
    collateralCoverage: number;
    totalCollateralInUSD: number;
    collateralThreshold: number;
}

const getInformationText = (
    totalCollateralInUSD: number,
    borrowLimit: number,
    collateralThreshold: number
) => {
    if (totalCollateralInUSD === 0) return;
    return (
        <div className='flex flex-col gap-4'>
            <div>
                <span>Your total borrow limit is at </span>
                <span className='text-nebulaTeal'>
                    {usdFormat(borrowLimit, 2)}
                </span>
                <span>{` which is ${collateralThreshold}% of your ${usdFormat(
                    totalCollateralInUSD,
                    2
                )} collateral deposit.`}</span>
            </div>
            <div>
                {`Increasing collateral deposit will increase your borrow limit by
                ${collateralThreshold}% of its value.`}
            </div>
        </div>
    );
};

export const CollateralProgressBar = ({
    collateralCoverage = 0,
    totalCollateralInUSD = 0,
    collateralThreshold = 0,
}: CollateralProgressBarProps) => {
    collateralCoverage /= 100.0;

    const borrowLimit = (totalCollateralInUSD * collateralThreshold) / 100.0;

    const availableToBorrow = computeAvailableToBorrow(
        1,
        totalCollateralInUSD,
        collateralCoverage,
        collateralThreshold
    );

    return (
        <div
            className='pointer-events-none flex flex-col gap-3 rounded-lg px-5 pt-6 pb-12 hover:bg-black-20'
            data-testid='collateral-progress-bar'
        >
            <div className='flex flex-row items-end justify-between'>
                <span className='typography-body-2 text-slateGray'>
                    Collateral Utilization
                </span>
                <span className='typography-body-1 text-white'>
                    {totalCollateralInUSD === 0
                        ? 'N/A'
                        : percentFormat(collateralCoverage, 1)}
                </span>
            </div>
            <div className='flex flex-col gap-[6px]'>
                <div
                    style={{
                        width: `calc(100% * ${collateralCoverage} + 4px )`,
                    }}
                    className='transition-width duration-700 ease-in'
                    data-testid='collateral-progress-bar-tick'
                >
                    <Tick className='float-right h-5px w-2'></Tick>
                </div>
                <div className='relative h-5px w-full overflow-hidden rounded-full bg-black-60'>
                    <div
                        className='float-left h-full bg-nebulaTeal transition-width duration-700 ease-in'
                        style={{
                            width: `calc(100% * ${collateralCoverage})`,
                        }}
                        data-testid='collateral-progress-bar-track'
                    ></div>
                </div>
                {totalCollateralInUSD === 0 ? (
                    <div className='typography-caption mt-1 text-white'>
                        N/A
                    </div>
                ) : (
                    <div className='mt-1 flex w-full flex-row items-center gap-1'>
                        <div className='typography-caption flex flex-row text-planetaryPurple'>
                            <span className='whitespace-pre font-semibold text-nebulaTeal'>
                                {`${usdFormat(availableToBorrow, 2)} `}
                            </span>
                            <span>{`of ${usdFormat(
                                borrowLimit,
                                2
                            )} available`}</span>
                        </div>
                        <InformationPopover>
                            {getInformationText(
                                totalCollateralInUSD,
                                borrowLimit,
                                collateralThreshold
                            )}
                        </InformationPopover>
                    </div>
                )}
            </div>
        </div>
    );
};
