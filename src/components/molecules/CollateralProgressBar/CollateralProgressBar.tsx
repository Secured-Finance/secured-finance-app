import Tick from 'src/assets/icons/tick.svg';
import { Tooltip } from 'src/components/templates';
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
    collateralCoverage,
    totalCollateralInUSD,
    collateralThreshold,
}: CollateralProgressBarProps) => {
    collateralCoverage /= 100.0;

    const borrowLimit = (totalCollateralInUSD * collateralThreshold) / 100.0;

    const availableToBorrow = computeAvailableToBorrow(
        1,
        totalCollateralInUSD,
        collateralCoverage,
        collateralThreshold
    );

    const barWidth = Math.min(1, collateralCoverage);

    return (
        <div
            className='pointer-events-none flex flex-col gap-3 rounded-lg px-5 pb-12 pt-6 hover:bg-black-20'
            data-testid='collateral-progress-bar'
        >
            <div className='flex flex-row items-end justify-between'>
                <span className='typography-body-2 text-slateGray'>
                    Collateral Utilization
                </span>
                <span className='typography-body-1 text-white'>
                    {percentFormat(collateralCoverage, 1)}
                </span>
            </div>
            <div className='flex flex-col gap-[6px]'>
                <div
                    style={{
                        width: `calc(100% * ${barWidth} + 4px )`,
                    }}
                    className='transition-width duration-700 ease-in'
                    data-testid='collateral-progress-bar-tick'
                >
                    <Tick className='float-right h-5px w-2'></Tick>
                </div>
                <div className='h-5px w-full rounded-full bg-black-60'>
                    <div
                        className='float-left h-full bg-nebulaTeal transition-width duration-700 ease-in'
                        style={{
                            width: `calc(100% * ${barWidth})`,
                        }}
                        data-testid='collateral-progress-bar-track'
                    ></div>
                </div>
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
                    <Tooltip>
                        {getInformationText(
                            totalCollateralInUSD,
                            borrowLimit,
                            collateralThreshold
                        )}
                    </Tooltip>
                </div>
            </div>
        </div>
    );
};
