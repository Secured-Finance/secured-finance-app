import Tick from 'src/assets/icons/tick.svg';
import { InfoToolTip } from 'src/components/molecules';
import { PriceFormatter } from 'src/utils';

interface CollateralProgressBarProps {
    collateralCoverage: number;
    totalCollateralInUSD: number;
    collateralThreshold: number;
    availableToBorrow: number;
    account: string | undefined;
}

const getInformationText = (
    totalCollateralInUSD: number,
    collateralCoverage: number,
    availableToBorrow: number,
    collateralThreshold: number
) => {
    if (totalCollateralInUSD === 0) {
        return (
            <div>
                <span>Your current collateral balance is </span>
                <span className='font-semibold'>$0</span>
                <span>
                    . Deposit collateral assets to borrow on Secured Finance.
                </span>
            </div>
        );
    }
    const amount = collateralThreshold - collateralCoverage * 100;

    return (
        <div className='flex flex-col gap-4'>
            <div>
                <span>Your current borrow limit is at </span>
                <span className='text-nebulaTeal'>
                    {PriceFormatter.formatUSDValue(availableToBorrow)}
                </span>
                <span>{` which is ${PriceFormatter.formatPercentage(
                    amount
                )} of your ${PriceFormatter.formatUSDValue(
                    totalCollateralInUSD
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
    availableToBorrow,
    account,
}: CollateralProgressBarProps) => {
    collateralCoverage /= 100.0;

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
                    {PriceFormatter.formatPercentage(collateralCoverage, 'raw')}
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
                {!account ? (
                    <div className='typography-caption mt-1 text-white'>
                        N/A
                    </div>
                ) : (
                    <div className='mt-1 flex w-full flex-row items-center gap-1'>
                        <div className='typography-caption flex flex-row text-planetaryPurple'>
                            <span className='whitespace-pre font-semibold text-nebulaTeal'>
                                {`${PriceFormatter.formatUSDValue(
                                    availableToBorrow
                                )} `}
                            </span>
                            <span>{`of ${PriceFormatter.formatUSDValue(
                                totalCollateralInUSD
                            )} available`}</span>
                        </div>
                        <InfoToolTip placement='bottom-start'>
                            {getInformationText(
                                totalCollateralInUSD,
                                collateralCoverage,
                                availableToBorrow,
                                collateralThreshold
                            )}
                        </InfoToolTip>
                    </div>
                )}
            </div>
        </div>
    );
};
