import clsx from 'clsx';
import { InfoToolTip } from 'src/components/molecules';
import { Alignment, ColorFormat } from 'src/types';
import {
    CurrencySymbol,
    currencyMap,
    ordinaryFormat,
    usdFormat,
    usdFormatPrice,
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
    truncate = false,
}: {
    amount?: bigint;
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
    truncate?: boolean;
} & ColorFormat) => {
    let secondLine: string;
    const currency = currencyMap[ccy];
    if (amount !== undefined && price !== undefined) {
        secondLine = usdFormat(currency.fromBaseUnit(amount) * price, 2);
    } else if (price) {
        secondLine = usdFormatPrice(price, ccy, 2);
    } else {
        secondLine = currency.name;
    }

    let firstLine: string;
    if (label !== undefined) {
        firstLine = label;
    } else if (amount !== undefined) {
        firstLine = ordinaryFormat(
            currency.fromBaseUnit(amount),
            minDecimals,
            maxDecimals
        );
        if (showCurrency) {
            firstLine += ` ${ccy}`;
        }
    } else {
        firstLine = ccy;
    }

    return (
        <div
            data-testid='currency-amount-item'
            className={clsx('flex min-w-0 flex-col', {
                'text-right': align === 'right',
                'text-center': align === 'center',
                'text-left': align === 'left',
                'shrink-0': align === 'right',
            })}
        >
            <span
                className={clsx(fontSize, {
                    'text-galacticOrange': color === 'negative',
                    'text-nebulaTeal': color === 'positive',
                    'text-neutral-8': color === 'neutral',
                    'flex flex-row items-center gap-2': warning,
                    'justify-center': align === 'center' && warning,
                    'justify-end': align === 'right' && warning,
                    'justify-start': align === 'left' && warning,
                    'h-6': !compact,
                })}
            >
                <span>{firstLine}</span>
                {warning && (
                    <InfoToolTip iconColor='yellow'>{warning}</InfoToolTip>
                )}
            </span>
            {compact === false ? (
                <span
                    className={clsx('typography-caption-2 h-5 text-[#6F74B0]', {
                        truncate: truncate,
                    })}
                >
                    {secondLine}
                </span>
            ) : null}
        </div>
    );
};
