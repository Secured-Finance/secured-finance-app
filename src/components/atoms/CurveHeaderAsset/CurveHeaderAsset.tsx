import { CurrencyIcon } from 'src/components/atoms';
import {
    currencyMap,
    CurrencySymbol,
    percentFormat,
    usdFormat,
} from 'src/utils';

interface CurveHeaderAssetProps {
    ccy: CurrencySymbol;
    value: number;
    fluctuation: number;
}

export const CurveHeaderAsset = ({
    ccy,
    value,
    fluctuation,
}: CurveHeaderAssetProps) => {
    return (
        <div className='flex h-[44px] w-fit flex-row items-center justify-between gap-3'>
            <div>
                <CurrencyIcon ccy={ccy} variant='large' />
            </div>
            <div className='flex h-full w-full flex-col'>
                <span className='typography-caption-2 h-5 text-planetaryPurple'>
                    {currencyMap[ccy].name}
                </span>
                <div className='flex h-6 w-full flex-row items-center justify-between gap-3'>
                    <span className='typography-caption flex h-full items-center text-neutral-8'>
                        {usdFormat(value, 2)}
                    </span>
                    <span
                        className={`typography-caption flex h-full items-center ${
                            fluctuation > 0
                                ? 'text-nebulaTeal'
                                : 'text-galacticOrange'
                        }`}
                    >
                        {percentFormat(fluctuation)}
                    </span>
                </div>
            </div>
        </div>
    );
};
