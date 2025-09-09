import Tick from 'src/assets/icons/tick.svg';
import { getLiquidationInformation } from 'src/components/atoms';
import { InfoToolTip } from 'src/components/molecules';
import { formatter } from 'src/utils';

interface LiquidationProgressBarProps {
    liquidationPercentage: number;
    collateralThreshold: number;
    account: string | undefined;
}

const getInformationText = (
    liquidationPercentage: number,
    collateralThreshold: number
) => {
    return (
        <div className='flex flex-col gap-4'>
            <div>
                Liquidation threshold is the limit where your collateral will be
                eligible for liquidation.
            </div>
            <div>
                <span>You are currently </span>
                <span className='text-nebulaTeal'>
                    {formatter.percentage(
                        collateralThreshold > liquidationPercentage
                            ? collateralThreshold - liquidationPercentage
                            : 0,
                        2,
                        1
                    )}
                </span>
                <span>{` under the liquidation threshold (${collateralThreshold}% of deposit balance).`}</span>
            </div>
        </div>
    );
};

export const LiquidationProgressBar = ({
    liquidationPercentage = 0,
    collateralThreshold,
    account,
}: LiquidationProgressBarProps) => {
    let padding =
        collateralThreshold !== 0
            ? liquidationPercentage / collateralThreshold
            : 0;
    if (padding > 1) {
        padding = 1;
    }

    const info = getLiquidationInformation(liquidationPercentage);

    return (
        <div
            className='pointer-events-none flex flex-col gap-3 rounded-lg px-5 pb-12 pt-6 hover:bg-black-20'
            data-testid='liquidation-progress-bar'
        >
            <div className='flex flex-row items-end justify-between'>
                <span className='typography-body-2 text-slateGray'>
                    Liquidation Risk
                </span>
                <span className={`typography-body-1 ${info.color}`}>
                    {info.risk}
                </span>
            </div>
            <div className='flex flex-col gap-[6px]'>
                <div
                    style={{ width: `calc(100% * ${padding} + 4px )` }}
                    className='transition-width duration-700 ease-in'
                    data-testid='liquidation-progress-bar-tick'
                >
                    <Tick className='float-right h-5px w-2'></Tick>
                </div>
                <div className='h-5px w-full rounded-full bg-gradient-to-r from-progressBarStart from-0% via-progressBarVia via-45% to-progressBarEnd to-80%'></div>
                {!account ? (
                    <div className='typography-caption mt-1 text-white'>
                        N/A
                    </div>
                ) : (
                    <div className='mt-1 flex w-full flex-row items-center gap-1'>
                        <div className='typography-caption'>
                            <span
                                className={`whitespace-pre font-semibold ${info.color}`}
                            >
                                {formatter.percentage(
                                    collateralThreshold > liquidationPercentage
                                        ? collateralThreshold -
                                              liquidationPercentage
                                        : 0,
                                    2,
                                    1
                                )}
                            </span>
                            <span className='text-planetaryPurple'>
                                {` threshold to liquidation`}
                            </span>
                        </div>
                        <InfoToolTip>
                            {getInformationText(
                                liquidationPercentage,
                                collateralThreshold
                            )}
                        </InfoToolTip>
                    </div>
                )}
            </div>
        </div>
    );
};
