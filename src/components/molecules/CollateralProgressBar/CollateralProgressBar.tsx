import BlockedCollateral from 'src/assets/icons/blocked-collateral.svg';
import Tick from 'src/assets/icons/tick.svg';
import { InformationPopover } from 'src/components/atoms';
import { COLLATERAL_THRESHOLD, percentFormat, usdFormat } from 'src/utils';

interface CollateralProgressBarProps {
    percentage: number;
    collateralAmount: number;
    totalCollateral: number;
}

const formatInformationText = (
    collateralAmount: number,
    totalCollateral: number,
    borrowLimit: number
) => {
    if (totalCollateral === 0) return '';
    return `You currently have ${usdFormat(
        borrowLimit - collateralAmount,
        2
    )} available to borrow. Your total borrow limit is at ${usdFormat(
        borrowLimit,
        2
    )} which is equivalent to ${COLLATERAL_THRESHOLD}% of your collateral deposit (${usdFormat(
        totalCollateral,
        2
    )}).`;
};

export const CollateralProgressBar = ({
    collateralAmount = 0,
    totalCollateral = 0,
}: CollateralProgressBarProps) => {
    let collateralToTotalRatio = 0;
    let borrowLimit = 0;
    let collateralLimitPercentage = 0;

    if (totalCollateral !== 0) {
        collateralToTotalRatio =
            collateralAmount > totalCollateral
                ? 1
                : collateralAmount / totalCollateral;
        borrowLimit = (totalCollateral * COLLATERAL_THRESHOLD) / 100.0;
        collateralLimitPercentage = collateralAmount / borrowLimit;
    }

    const informationText = formatInformationText(
        collateralAmount,
        totalCollateral,
        borrowLimit
    );

    return (
        <div className='flex flex-col gap-3'>
            <div className='flex flex-row items-end justify-between'>
                <span className='typography-body-2 text-slateGray'>
                    Collateral Utilization
                </span>
                <span className='typography-body-1 text-white'>
                    {totalCollateral === 0
                        ? 'N/A'
                        : percentFormat(collateralLimitPercentage, 1)}
                </span>
            </div>
            <div
                className='flex flex-col gap-[6px]'
                data-testid='collateral-progress-bar'
            >
                <div
                    style={{
                        width: `calc(100% * ${collateralToTotalRatio} + 4px )`,
                    }}
                    className='transition-width duration-700 ease-in'
                >
                    <Tick className='float-right h-5px w-2'></Tick>
                </div>
                <div className='relative h-5px w-full overflow-hidden rounded-full bg-black-60'>
                    <div
                        className='float-left h-full bg-gradient-to-l from-purple to-[#833EA8] transition-width duration-700 ease-in'
                        style={{
                            width: `calc(100% * ${collateralToTotalRatio})`,
                        }}
                    ></div>
                    <BlockedCollateral
                        preserveAspectRatio='xMidYMid slice'
                        className='absolute right-0 h-full'
                        style={{ width: `calc(100% * 0.26 )` }}
                    ></BlockedCollateral>
                </div>
                {totalCollateral === 0 ? (
                    <div className='typography-caption mt-1 text-white'>
                        N/A
                    </div>
                ) : (
                    <div className='mt-1 flex w-full flex-row items-center gap-1'>
                        <div className='typography-caption flex flex-row text-planetaryPurple'>
                            <span className='whitespace-pre font-semibold text-purple'>
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
