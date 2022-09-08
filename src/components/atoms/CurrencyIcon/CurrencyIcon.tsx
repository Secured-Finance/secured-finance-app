import classNames from 'classnames';
import { useMemo } from 'react';
import { currencyMap, CurrencySymbol } from 'src/utils';

export const CurrencyIcon = ({
    ccy,
    variant = 'default',
}: {
    ccy: CurrencySymbol;
    variant?: 'default' | 'large';
}) => {
    const Icon = useMemo(() => currencyMap[ccy].icon, [ccy]);
    return (
        <Icon
            className={classNames({
                'h-6 w-6': variant === 'default',
                'h-10 w-10': variant === 'large',
            })}
            role='img'
        />
    );
};
