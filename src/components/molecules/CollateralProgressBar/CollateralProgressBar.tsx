import Tick from 'src/assets/icons/tick.svg';
import { InfoToolTip } from 'src/components/molecules';
import { FINANCIAL_CONSTANTS } from 'src/config/constants';
import { formatter } from 'src/utils';

interface CollateralProgressBarProps {
    collateralCoverage: number;
    totalCollateralInUSD: number;
    liquidationThreshold: number;
    availableToBorrow: number;
    account: string | undefined;
}

const getInformationText = (
    totalCollateralInUSD: number,
    collateralCoverage: number,
    availableToBorrow: number,
    liquidationThreshold: number
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
    return (
        <div className='flex flex-col gap-4'>
            <div>
                <span>Your current borrow limit is at </span>
                <span className='text-nebulaTeal'>
                    {formatter.usd(
                        availableToBorrow,
                        FINANCIAL_CONSTANTS.DEFAULT_DECIMALS
                    )}
                </span>
                <span>{` which is ${formatter.percentage(
                    liquidationThreshold -
                        collateralCoverage /
                            FINANCIAL_CONSTANTS.PERCENTAGE_DIVISOR,
                    FINANCIAL_CONSTANTS.DEFAULT_DECIMALS,
                    FINANCIAL_CONSTANTS.DEFAULT_ONE_DECIMALS
                )} of your ${formatter.usd(
                    totalCollateralInUSD,
                    FINANCIAL_CONSTANTS.DEFAULT_DECIMALS
                )} collateral deposit.`}</span>
            </div>
            <div>
                {`Increasing collateral deposit will increase your borrow limit by
                ${formatter.percentage(
                    liquidationThreshold,
                    FINANCIAL_CONSTANTS.DEFAULT_DECIMALS,
                    FINANCIAL_CONSTANTS.DEFAULT_ONE_DECIMALS
                )} of its value.`}
            </div>
        </div>
    );
};

export const CollateralProgressBar = ({
    collateralCoverage = 0,
    totalCollateralInUSD = 0,
    liquidationThreshold = 0,
    availableToBorrow,
    account,
}: CollateralProgressBarProps) => {
    const coverageAsDecimal =
        collateralCoverage / FINANCIAL_CONSTANTS.PERCENTAGE_DIVISOR;
    const barWidth = Math.min(1, coverageAsDecimal);

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
                    {formatter.percentage(collateralCoverage)}
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
                                {`${formatter.usd(
                                    availableToBorrow,
                                    FINANCIAL_CONSTANTS.DEFAULT_DECIMALS
                                )} `}
                            </span>
                            <span>{`of ${formatter.usd(
                                totalCollateralInUSD,
                                FINANCIAL_CONSTANTS.DEFAULT_DECIMALS
                            )} available`}</span>
                        </div>
                        <InfoToolTip placement='bottom-start'>
                            {getInformationText(
                                totalCollateralInUSD,
                                collateralCoverage,
                                availableToBorrow,
                                liquidationThreshold
                            )}
                        </InfoToolTip>
                    </div>
                )}
            </div>
        </div>
    );
};
