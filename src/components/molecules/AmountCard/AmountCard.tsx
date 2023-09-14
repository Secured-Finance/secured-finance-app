import {
    CurrencySymbol,
    ordinaryFormat,
    prefixTilde,
    usdFormat,
} from 'src/utils';
import { Amount } from 'src/utils/entities';

export const AmountCard = ({
    amount,
    price,
}: {
    amount: Amount;
    price: number;
}) => {
    const currencyName: Record<CurrencySymbol, string> = {
        [CurrencySymbol.USDC]: 'USD Coin',
        [CurrencySymbol.WFIL]: 'Wrapped Filecoin',
        [CurrencySymbol.WBTC]: 'Bitcoin',
        [CurrencySymbol.ETH]: 'Ethereum',
    };

    return (
        <div className='grid w-full grid-cols-2 justify-around'>
            <div className='grid items-center justify-start'>
                <span className='typography font-bold text-white'>
                    {amount.currency}
                </span>
                <span className='typography-caption-3 text-white-60'>
                    {currencyName[amount.currency]}
                </span>
            </div>
            <div className='grid items-center justify-end'>
                <span className='typography-body-1 font-bold text-white'>
                    {ordinaryFormat(amount.value)}
                </span>
                <div className='typography-caption-3 text-right text-white-60'>
                    {prefixTilde(usdFormat(amount.toUSD(price)))}
                </div>
            </div>
        </div>
    );
};
