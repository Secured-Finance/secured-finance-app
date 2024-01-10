import Tick from 'src/assets/icons/tick.svg';
import { Separator } from 'src/components/atoms';
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

    return (
        <div className='flex h-fit w-full flex-col gap-3 rounded-b pb-4 pt-2 tablet:gap-0'>
            <div className='flex flex-col rounded-xl bg-black-20 px-4 pb-5 pt-4 tablet:rounded-none'>
                <div className='typography-caption mb-3 flex flex-row justify-between text-grayScale'>
                    <span>Collateral Utilization</span>
                    <span>{percentFormat(collateralCoverage, 100)}</span>
                </div>
                <div className='h-6px w-full overflow-hidden rounded-full bg-[#2A313C]'>
                    <div
                        className='h-full rounded-full bg-nebulaTeal transition-width duration-700 ease-in'
                        style={{
                            width: `calc(100% * ${padding})`,
                        }}
                        data-testid='collateral-progress-bar-track'
                    ></div>
                </div>
                <div className='typography-caption-2 mt-1 leading-6 text-planetaryPurple'>
                    {account
                        ? `Available: ${usdFormat(availableToBorrow, 2)}`
                        : 'N/A'}
                </div>
            </div>
            <div className='hidden tablet:block'>
                <Separator color='neutral-3' />
            </div>
            <div className='flex flex-col rounded-xl bg-black-20 px-4 pb-4 pt-5 tablet:rounded-none'>
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
