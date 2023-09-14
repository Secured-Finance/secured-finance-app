import { CurrencyIcon } from 'src/components/atoms';
import { currencyMap, formatAmount, prefixTilde, usdFormat } from 'src/utils';
import { Amount } from 'src/utils/entities';

export const AmountCard = ({
    amount,
    price,
}: {
    amount: Amount;
    price: number;
}) => {
    return (
        <div className='grid w-full grid-cols-2 justify-around'>
            <div className='flex flex-row items-center justify-start gap-2'>
                <span>
                    <CurrencyIcon ccy={amount.currency} />
                </span>
                <span className='typography-caption font-bold text-white'>
                    {currencyMap[amount.currency].name}
                </span>
            </div>
            <div className='flex h-6 flex-row items-center justify-end gap-2'>
                <span className='typography-body-1 font-bold text-white'>
                    {formatAmount(amount.value)}
                </span>
                <span className='typography-caption h-5 text-white-60'>
                    {amount.currency}
                </span>
            </div>
            <div></div>
            <div className='typography-caption-3 text-right text-white-60'>
                {prefixTilde(usdFormat(amount.toUSD(price)))}
            </div>
        </div>
    );
};
