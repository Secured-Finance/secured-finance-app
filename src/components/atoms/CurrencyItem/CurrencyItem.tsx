import classNames from 'classnames';
import { ColorFormat } from 'src/types';
import {
    currencyMap,
    CurrencySymbol,
    ordinaryFormat,
    usdFormatAppendUSD,
} from 'src/utils';

export const CurrencyItem = ({
    amount,
    ccy,
    price,
    align = 'left',
    color = 'neutral',
}: {
    amount?: number;
    ccy: CurrencySymbol;
    price?: number;
    align?: 'left' | 'right' | 'center';
} & ColorFormat) => {
    let secondLine: string;
    if (amount !== undefined && price !== undefined) {
        secondLine = usdFormatAppendUSD(amount * price, 2);
    } else if (price) {
        secondLine = usdFormatAppendUSD(price, 2);
    } else {
        secondLine = currencyMap[ccy].name;
    }

    const firstLine = amount ? `${ordinaryFormat(amount)} ${ccy}` : ccy;
    return (
        <div
            data-testid='currency-amount-item'
            className={classNames('flex flex-col', {
                'text-right': align === 'right',
                'text-center': align === 'center',
                'text-left': align === 'left',
            })}
        >
            <span
                className={classNames('typography-caption h-6', {
                    'text-galacticOrange': color === 'negative',
                    'text-nebulaTeal': color === 'positive',
                    'text-neutral-8': color === 'neutral',
                })}
            >
                {firstLine}
            </span>
            <span className='typography-caption-2 h-5 text-[#6F74B0]'>
                {secondLine}
            </span>
        </div>
    );
};
