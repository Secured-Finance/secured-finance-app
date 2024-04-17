import clsx from 'clsx';
import Tick from 'src/assets/icons/tick.svg';
import { emptyCollateralBook, useCollateralBook } from 'src/hooks';
import { percentFormat, usdFormat } from 'src/utils';
import { THRESHOLD_BLOCKS } from './constants';

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
    const { data: collateralBook = emptyCollateralBook } =
        useCollateralBook(account);
    const threshold =
        collateralThreshold && collateralThreshold > collateralCoverage
            ? collateralThreshold - collateralCoverage
            : 0;

    const totalCollateralInUSD = account ? collateralBook.usdCollateral : 0;

    return (
        <div className='flex h-fit w-full flex-col gap-3 rounded-b'>
            <div className='flex flex-col gap-3 rounded-xl border border-neutral-600 bg-neutral-900 p-4'>
                <div className='flex flex-row justify-between text-sm leading-6 text-grayScale'>
                    <span>Collateral Utilization</span>
                    <span className='font-semibold text-secondary-300'>
                        {percentFormat(collateralCoverage, 100)}
                    </span>
                </div>
                <div className='flex flex-col gap-2'>
                    <div className='h-6px w-full overflow-hidden rounded-full bg-neutral-700'>
                        <div
                            className='h-full rounded-full bg-secondary-300 transition-width duration-700 ease-in'
                            style={{
                                width: `calc(100% * ${padding})`,
                            }}
                            data-testid='collateral-progress-bar-track'
                        ></div>
                    </div>
                    <div className='flex items-center justify-start gap-x-1 text-[11px] leading-[15px] text-neutral-300'>
                        {!account && !totalCollateralInUSD ? (
                            'N/A'
                        ) : (
                            <>
                                <span className='font-semibold text-secondary-300'>
                                    {`${usdFormat(availableToBorrow, 2)} `}
                                </span>
                                <span>{`of ${usdFormat(
                                    totalCollateralInUSD,
                                    2
                                )} available`}</span>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className='flex flex-col rounded-xl border border-neutral-600 bg-neutral-900 p-4'>
                <div className='typography-caption mb-4 flex flex-row justify-between'>
                    <span className='text-grayScale'>Liquidation Risk</span>
                    <span className={info.color}>{info.risk}</span>
                </div>
                <ul className='grid grid-cols-5 gap-[7.25px]'>
                    {THRESHOLD_BLOCKS.map((block, i) => {
                        const min = i * 20;
                        const max = (i + 1) * 20;

                        const offset = Math.round(
                            ((collateralCoverage - min) / (max - min)) * 100
                        );

                        return (
                            <li
                                key={`threshold-bar-${i}`}
                                className={clsx(
                                    'relative h-[6px] overflow-visible rounded-xl bg-gradient-to-r',
                                    block.className,
                                    {
                                        [`border ${block.borderClassName}`]:
                                            (collateralCoverage === 0 && !i) ||
                                            (collateralCoverage > min &&
                                                collateralCoverage <= max),
                                    }
                                )}
                            >
                                {collateralCoverage === 0 && !i ? (
                                    <Tick
                                        className='absolute -top-[9px] h-5px w-2.5'
                                        style={{
                                            left: `calc(0% - 4px)`,
                                        }}
                                        data-testid='liquidation-progress-bar-tick'
                                    />
                                ) : (
                                    collateralCoverage > min &&
                                    collateralCoverage <= max && (
                                        <Tick
                                            className='absolute -top-[9px] h-5px w-2.5'
                                            style={{
                                                left: `calc(${offset}% - 4px)`,
                                            }}
                                            data-testid='liquidation-progress-bar-tick'
                                        />
                                    )
                                )}
                            </li>
                        );
                    })}
                </ul>
                <div className='mt-1 text-[11px] leading-6 text-planetaryPurple'>
                    {account ? (
                        <>
                            Threshold:{' '}
                            <span className='font-semibold'>
                                {percentFormat(threshold)}
                            </span>
                        </>
                    ) : (
                        'N/A'
                    )}
                </div>
                {account && <Notification percentage={threshold} />}
            </div>
        </div>
    );
};

const Notification = ({ percentage }: { percentage: number }) => {
    const getRiskLevel = () => {
        if (percentage >= 80) {
            return {
                text: 'very high risk',
                className: 'text-error5',
            };
        }

        if (percentage >= 60) {
            return {
                text: 'high risk',
                className: 'text-error-300',
            };
        }

        if (percentage >= 40) {
            return {
                text: 'medium risk',
                className: 'text-yellow',
            };
        }

        return {
            text: 'lower risk',
            className: 'text-[#00C096]',
        };
    };

    const riskLevel = getRiskLevel();

    if (percentage >= 20) {
        return (
            <div className='flex flex-col pt-[0.375rem] text-xs text-secondary7'>
                <p>
                    Your funds are currently at{' '}
                    <span className={riskLevel.className}>
                        {riskLevel.text}
                    </span>{' '}
                    of liquidation.
                </p>
                <p>
                    <span className='font-semibold text-neutral-50 underline'>
                        Deposit collateral
                    </span>{' '}
                    to prevent liquidation.
                </p>
            </div>
        );
    }

    return (
        <p className='text-xs text-secondary7'>
            Your funds are currently not at risk of liquidation.
        </p>
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
