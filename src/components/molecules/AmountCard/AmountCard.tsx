import { currencyMap, formatAmount, prefixTilde, usdFormat } from 'src/utils';
import { Amount } from 'src/utils/entities';

export const AmountCard = ({
    amount,
    price,
}: {
    amount: Amount;
    price: number;
}) => (
    <div className='mb-3 grid w-full grid-cols-2 justify-around'>
        <div className='grid items-center justify-start'>
            <span className='typography font-bold text-white'>
                {amount.currency}
            </span>
            <span className='typography-caption-3 text-white-60'>
                {currencyMap[amount.currency].longName}
            </span>
        </div>
        <div className='grid items-center justify-end'>
            <span className='typography-body-1 font-bold text-white'>
                {formatAmount(amount.value)}
            </span>
            <div className='typography-caption-3 text-right text-white-60'>
                {prefixTilde(usdFormat(amount.toUSD(price)))}
            </div>
        </div>
    </div>
);
