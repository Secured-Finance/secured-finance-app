import Tick from 'src/assets/icons/tick.svg';
import { InformationPopover } from 'src/components/atoms';

interface LiquidationProgressBarProps {
    liquidationPercentage: number;
}

const formatInformationText = (liquidationPercentage: number) => {
    if (liquidationPercentage === 0) return '';
    return `You are currently at ${liquidationPercentage}% to liquidation. Upon reaching the liquidation threshold (80% LTV), 50% of assets will automatically be liquidated to repay the lender. Liquidation will be subject to 5% liquation fee.`;
};

export const LiquidationProgressBar = ({
    liquidationPercentage = 0,
}: LiquidationProgressBarProps) => {
    let padding = liquidationPercentage * 0.0125;
    if (padding > 1) {
        padding = 1;
    }

    const informationText = formatInformationText(liquidationPercentage);

    return (
        <div className='flex flex-col gap-3'>
            <div className='flex flex-row items-end justify-between'>
                <span className='typography-body-2 text-slateGray'>
                    Liquidation Risk
                </span>
                <span className='typography-body-1 text-white'>
                    {liquidationPercentage === 0 ? 'N/A' : 'Low'}
                </span>
            </div>
            <div
                className='flex flex-col gap-[6px]'
                data-testid='liquidation-progress-bar'
            >
                <div
                    style={{ width: `calc(100% * ${padding} + 4px )` }}
                    className='transition-width duration-700 ease-in'
                >
                    <Tick className='float-right h-5px w-2'></Tick>
                </div>
                <div className='h-5px w-full rounded-full bg-gradient-to-r from-[rgba(48,224,161,1)] via-[rgba(247,147,26,1)] to-[rgba(250,34,86,1)]'></div>
                {liquidationPercentage === 0 ? (
                    <div className='typography-caption mt-1 text-white'>
                        N/A
                    </div>
                ) : (
                    <div className='mt-1 flex w-full flex-row items-center gap-1'>
                        <div className='typography-caption text-planetaryPurple'>
                            <span className='whitespace-pre font-semibold'>
                                {`${liquidationPercentage}% `}
                            </span>
                            <span>threshold to liquidation</span>
                        </div>
                        <InformationPopover text={informationText} />
                    </div>
                )}
            </div>
        </div>
    );
};
