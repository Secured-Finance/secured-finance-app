import classNames from 'classnames';
import { useMemo } from 'react';
import { currencyMap, CurrencySymbol } from 'src/utils';

export const CurrencyIcon = ({
    ccy,
    asset = 'currency',
    variant = 'default',
}: {
    ccy: CurrencySymbol;
    asset?: 'currency' | 'zero-coupon';
    variant?: 'default' | 'large' | 'small';
}) => {
    const Icon = useMemo(() => {
        if (asset === 'zero-coupon') return currencyMap[ccy].zcIcon;
        return currencyMap[ccy].icon;
    }, [asset, ccy]);

    return (
        <Icon
            className={classNames({
                'h-6 w-6': variant === 'default',
                'h-9 w-9': variant === 'large',
                'h-5 w-5': variant === 'small',
            })}
            role='img'
            aria-label={ccy}
        />
    );
};
