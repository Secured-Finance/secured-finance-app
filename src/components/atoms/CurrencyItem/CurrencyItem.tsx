import clsx from 'clsx';
import { InfoToolTip } from 'src/components/molecules';
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
    label,
    price,
    align = 'left',
    color = 'neutral',
    compact = false,
    fontSize = 'typography-caption',
    minDecimals = 0,
    maxDecimals = 2,
    showCurrency = false,
    warning,
}: {
    amount?: number;
    ccy: CurrencySymbol;
    label?: string;
    price?: number;
    align?: Alignment;
    compact?: boolean;
    fontSize?: string;
    minDecimals?: number;
    maxDecimals?: number;
    showCurrency?: boolean;
    warning?: string;
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
    if (label !== undefined) {
        firstLine = label;
    } else if (amount !== undefined) {
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
            className={clsx('flex flex-col', {
                'text-right': align === 'right',
                'text-center': align === 'center',
                'text-left': align === 'left',
            })}
        >
            <span
                className={clsx(fontSize, 'h-6', {
                    'text-galacticOrange': color === 'negative',
                    'text-nebulaTeal': color === 'positive',
                    'text-neutral-8': color === 'neutral',
                    'flex flex-row items-center gap-2': warning,
                    'justify-center': align === 'center' && warning,
                    'justify-end': align === 'right' && warning,
                    'justify-start': align === 'left' && warning,
                })}
            >
                <span>{firstLine}</span>
                {warning && (
                    <InfoToolTip iconColor='yellow'>{warning}</InfoToolTip>
                )}
            </span>
            {compact === false ? (
                <span className='typography-caption-2 h-5 text-[#6F74B0]'>
                    {secondLine}
                </span>
            ) : null}
        </div>
    );
};
