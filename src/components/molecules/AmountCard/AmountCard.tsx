import { CurrencyIcon } from 'src/components/atoms';
import {
    currencyMap,
    CurrencySymbol,
    ordinaryFormat,
    usdFormatAppendUSD,
} from 'src/utils';

export const AmountCard = ({
    ccy,
    amount,
    price,
}: {
    ccy: CurrencySymbol;
    amount: number;
    price: number;
}) => {
    return (
        <div className='grid w-full grid-cols-2 justify-around'>
            <div className='flex flex-row items-center justify-start gap-2'>
                <span>
                    <CurrencyIcon ccy={ccy} />
                </span>
                <span className='typography-caption font-bold text-white'>
                    {currencyMap[ccy].name}
                </span>
            </div>
            <div className='flex flex-row items-center justify-end gap-2'>
                <span className='typography-body-1 font-bold text-white'>
                    {ordinaryFormat(amount)}
                </span>
                <span className='typography-caption text-white-60'>{ccy}</span>
            </div>
            <div></div>
            <div className='typography-caption-3 text-right text-white-60'>
                ~ {usdFormatAppendUSD(price * amount)}
            </div>
        </div>
    );
};
