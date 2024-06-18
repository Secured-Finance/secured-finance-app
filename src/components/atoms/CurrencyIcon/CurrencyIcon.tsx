import clsx from 'clsx';
import { useMemo } from 'react';
import { currencyMap, CurrencySymbol } from 'src/utils';

export const CurrencyIcon = ({
    ccy,
    variant = 'default',
}: {
    ccy: CurrencySymbol;
    variant?: 'default' | 'large' | 'small' | 'campaign';
}) => {
    const Icon = useMemo(() => currencyMap[ccy].icon, [ccy]);
    return (
        <Icon
            className={clsx({
                'h-6 w-6': variant === 'default',
                'h-9 w-9': variant === 'large',
                'h-5 w-5': variant === 'small',
                'h-[18px] w-[18px]': variant === 'campaign',
            })}
            role='img'
            aria-label={ccy}
        />
    );
};
