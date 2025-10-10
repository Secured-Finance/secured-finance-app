import { CurrencyIcon } from 'src/components/atoms';
import {
    currencyMap,
    CurrencySymbol,
    formatter,
    FORMAT_DIGITS,
} from 'src/utils';

interface CurveHeaderAssetProps {
    ccy: CurrencySymbol;
    value: number;
}

export const CurveHeaderAsset = ({ ccy, value }: CurveHeaderAssetProps) => {
    return (
        <div className='flex h-[44px] w-fit flex-row items-center justify-between gap-3'>
            <div>
                <CurrencyIcon ccy={ccy} variant='large' />
            </div>
            <div className='flex h-full w-full flex-col'>
                <span className='typography-caption-2 h-5 text-planetaryPurple'>
                    {currencyMap[ccy].name}
                </span>
                <span className='typography-caption flex h-full items-center text-neutral-8'>
                    {formatter.usd(value, FORMAT_DIGITS.PRICE)}
                </span>
            </div>
        </div>
    );
};
