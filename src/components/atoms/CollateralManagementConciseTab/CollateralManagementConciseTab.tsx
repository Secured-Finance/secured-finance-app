import clsx from 'clsx';
import Tick from 'src/assets/icons/tick.svg';
import { emptyCollateralBook, useCollateralBook } from 'src/hooks';
import { percentFormat, usdFormat } from 'src/utils';
import { TRESHOLD_BLOCKS } from './constants';

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
    const treshold =
        collateralThreshold && collateralThreshold > collateralCoverage
            ? collateralThreshold - collateralCoverage
            : 0;

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
                    <span className={info.color}>{info.risk}</span>
                </div>
                {/* TODO: handle positioning of arrow to avoid blanks */}
                <div
                    style={{
                        width: `calc(100% * ${padding} + 4px )`,
                    }}
                    className='transition-width duration-700 ease-in'
                    data-testid='liquidation-progress-bar-tick'
                >
                    <Tick className='float-right h-5px w-2'></Tick>
                </div>

                <ul className='grid grid-cols-5 gap-[7.25px]'>
                    {TRESHOLD_BLOCKS.map((block, i) => {
                        return (
                            <li
                                key={`mobile-threshold-${i}`}
                                className={clsx(
                                    'h-[6px] overflow-hidden rounded-xl bg-gradient-to-r',
                                    block.className
                                )}
                            ></li>
                        );
                    })}
                </ul>
                <div className='mt-1 text-[11px] leading-6 text-planetaryPurple'>
                    {account ? (
                        <>
                            Threshold:{' '}
                            <span className='font-semibold'>
                                {percentFormat(treshold)}
                            </span>
                        </>
                    ) : (
                        'N/A'
                    )}
                </div>
                {account && <Notification percentage={'61%'} />}
            </div>
        </div>
    );
};

const Notification = ({ percentage }: { percentage: string }) => {
    const percentageNumber = +percentage.replace('%', '');

    const getRiskLevel = () => {
        if (percentageNumber >= 80) {
            return {
                text: 'very high risk',
                color: '#FF324B',
            };
        }

        if (percentageNumber >= 60) {
            return {
                text: 'high risk',
                color: '#FF9FAE',
            };
        }

        if (percentageNumber >= 40) {
            return {
                text: 'medium risk',
                color: '#FAAD14',
            };
        }

        return {
            text: 'lower risk',
            color: '#00C096',
        };
    };

    const riskLevel = getRiskLevel();

    if (percentageNumber >= 20) {
        return (
            <div className='flex flex-col pt-[0.375rem] text-xs text-secondary7 tablet:hidden'>
                <p>
                    Your funds are currently at{' '}
                    <span style={{ color: riskLevel.color }}>
                        {riskLevel.text}
                    </span>{' '}
                    of liquidation.
                </p>
                <p>
                    <span className='font-semibold text-nebulaTeal underline'>
                        Add more funds
                    </span>{' '}
                    to increase your trading capacity.
                </p>
            </div>
        );
    }

    return (
        <p className='text-xs text-secondary7 tablet:hidden'>
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
