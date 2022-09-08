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

export const CurveHeaderAsset: React.FC<CurveHeaderAssetProps> = ({
    ccy,
    value,
    fluctuation,
}) => {
    return (
        <div className='flex h-[44px] w-36 flex-row justify-between gap-3 py-0.5 '>
            <div>
                <CurrencyIcon ccy={ccy} variant='large' />
            </div>
            <div className='flex h-full w-full flex-col'>
                <span className='typography-caption-2 h-5 text-planetaryPurple'>
                    {currencyMap[ccy].name}
                </span>
                <div className='flex h-5 w-full flex-row items-center justify-between'>
                    <span className='typography-caption flex h-full items-center text-neutral-8'>
                        {usdFormat(value, 2)}
                    </span>
                    <span
                        className={`typography-caption flex h-full items-center ${
                            fluctuation > 0 ? 'text-green' : 'text-red'
                        }`}
                    >
                        {percentFormat(fluctuation)}
                    </span>
                </div>
            </div>
        </div>
    );
};
