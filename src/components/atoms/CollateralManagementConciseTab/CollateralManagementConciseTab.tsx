import Tick from 'src/assets/icons/tick.svg';
import { emptyCollateralBook, useCollateralBook } from 'src/hooks';
import { percentFormat, usdFormat } from 'src/utils';

interface CollateralManagementConciseTabProps {
    collateralCoverage: number;
    availableToBorrow: number;
    collateralThreshold: number;
    account: string | undefined;
}

export const CollateralManagementConciseTab = ({
    collateralCoverage,
    availableToBorrow,
    collateralThreshold,
    account,
}: CollateralManagementConciseTabProps) => {
    let padding = collateralCoverage / 100.0;
    if (padding > 1) {
        padding = 1;
    }
    const info = getLiquidationInformation(collateralCoverage);
    const { data: collateralBook = emptyCollateralBook, isLoading } =
        useCollateralBook(account);

    // TODO: check if this is the "Locked" collateral value
    const totalCollateralInUSD = account ? collateralBook.usdCollateral : 0;

    return (
        <div className='flex h-fit w-full flex-col gap-3 rounded-b'>
            <div className='flex flex-col gap-3 rounded-xl border border-neutral-600 bg-neutral-900 p-4'>
                <div className='flex flex-row justify-between text-sm leading-6 text-grayScale'>
                    <span>Collateral Utilization</span>
                    <span className='font-semibold text-secondary-500'>
                        {percentFormat(collateralCoverage, 100)}
                    </span>
                </div>
                <div className='flex flex-col gap-2'>
                    <div className='h-6px w-full overflow-hidden rounded-full bg-[#2A313C]'>
                        <div
                            className='h-full rounded-full bg-secondary-500 transition-width duration-700 ease-in'
                            style={{
                                width: `calc(100% * ${padding})`,
                            }}
                            data-testid='collateral-progress-bar-track'
                        ></div>
                    </div>
                    <div className='flex items-center justify-between text-[11px] leading-[15px]'>
                        <span className='text-neutral-400'>
                            Locked:{' '}
                            {!isLoading && (
                                <span className='font-semibold'>
                                    {usdFormat(totalCollateralInUSD, 2)}
                                </span>
                            )}
                        </span>
                        <span className='typography-caption-2 text-secondary-700'>
                            {account ? (
                                <>
                                    Available:{' '}
                                    <span className='font-semibold'>
                                        {usdFormat(availableToBorrow, 2)}
                                    </span>
                                </>
                            ) : (
                                'N/A'
                            )}
                        </span>
                    </div>
                </div>
            </div>

            <div className='flex flex-col rounded-xl border border-neutral-600 bg-neutral-900 p-4'>
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
                <div className='mt-2 h-6px w-full rounded-full bg-gradient-to-r from-progressBarStart from-0% via-progressBarVia via-45% to-progressBarEnd to-80%'></div>
                <div className='typography-caption-2 mt-1 leading-6 text-planetaryPurple'>
                    {account
                        ? `Threshold: ${percentFormat(
                              collateralThreshold &&
                                  collateralThreshold > collateralCoverage
                                  ? collateralThreshold - collateralCoverage
                                  : 0
                          )}`
                        : 'N/A'}
                </div>
            </div>
        </div>
    );
};

export const getLiquidationInformation = (liquidationPercentage: number) => {
    if (liquidationPercentage < 40) {
        return { color: 'text-progressBarStart', risk: 'Low' };
    } else if (liquidationPercentage >= 40 && liquidationPercentage < 60) {
        return { color: 'text-progressBarVia', risk: 'Medium' };
    }
    return { color: 'text-progressBarEnd', risk: 'High' };
};
