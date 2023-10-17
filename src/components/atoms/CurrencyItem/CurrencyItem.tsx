import classNames from 'classnames';
import { Alignment, ColorFormat } from 'src/types';
import {
    CurrencySymbol,
    currencyMap,
    ordinaryFormat,
    usdFormat,
} from 'src/utils';

export const CurrencyItem = ({
    amount,
    ccy,
    price,
    align = 'left',
    color = 'neutral',
    compact = false,
    fontSize = 'typography-caption',
    minDecimals = 0,
    maxDecimals = 2,
    showCurrency = false,
}: {
    amount?: number;
    ccy: CurrencySymbol;
    price?: number;
    align?: Alignment;
    compact?: boolean;
    fontSize?: string;
    minDecimals?: number;
    maxDecimals?: number;
    showCurrency?: boolean;
} & ColorFormat) => {
    let secondLine: string;
    if (amount !== undefined && price !== undefined) {
        secondLine = usdFormat(amount * price, 2);
    } else if (price) {
        secondLine = usdFormat(price, 2);
    } else {
        secondLine = currencyMap[ccy].name;
    }

    let firstLine: string;
    if (amount !== undefined) {
        firstLine = ordinaryFormat(amount, minDecimals, maxDecimals);
        if (showCurrency) {
            firstLine += ` ${ccy}`;
        }
    } else {
        firstLine = ccy;
    }

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
                className={classNames(fontSize, 'h-6', {
                    'text-galacticOrange': color === 'negative',
                    'text-nebulaTeal': color === 'positive',
                    'text-neutral-8': color === 'neutral',
                })}
            >
                {firstLine}
            </span>
            {compact === false ? (
                <span className='typography-caption-2 h-5 text-[#6F74B0]'>
                    {secondLine}
                </span>
            ) : null}
        </div>
    );
};
