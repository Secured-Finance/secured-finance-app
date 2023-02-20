import Tick from 'src/assets/icons/tick.svg';
import { InformationPopover } from 'src/components/atoms';
import { COLLATERAL_THRESHOLD, percentFormat, usdFormat } from 'src/utils';

interface CollateralProgressBarProps {
    collateralCoverage: number;
    totalCollateralInUSD: number;
}

const formatInformationText = (
    collateralAmount: number,
    totalCollateralInUSD: number,
    borrowLimit: number
) => {
    if (totalCollateralInUSD === 0) return '';
    return `You currently have ${usdFormat(
        borrowLimit - collateralAmount,
        2
    )} available to borrow. Your total borrow limit is at ${usdFormat(
        borrowLimit,
        2
    )} which is equivalent to ${COLLATERAL_THRESHOLD}% of your collateral deposit (${usdFormat(
        totalCollateralInUSD,
        2
    )}).`;
};

export const CollateralProgressBar = ({
    collateralCoverage = 0,
    totalCollateralInUSD = 0,
}: CollateralProgressBarProps) => {
    collateralCoverage /= 100.0;
    const collateralAmount = collateralCoverage * totalCollateralInUSD;

    const borrowLimit = (totalCollateralInUSD * COLLATERAL_THRESHOLD) / 100.0;

    const informationText = formatInformationText(
        collateralAmount,
        totalCollateralInUSD,
        borrowLimit
    );

    return (
        <div
            className='flex flex-col gap-3'
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
                                {`${usdFormat(
                                    borrowLimit - collateralAmount,
                                    2
                                )} `}
                            </span>
                            <span>{`of ${usdFormat(
                                borrowLimit,
                                2
                            )} available`}</span>
                        </div>
                        <InformationPopover text={informationText} />
                    </div>
                )}
            </div>
        </div>
    );
};
