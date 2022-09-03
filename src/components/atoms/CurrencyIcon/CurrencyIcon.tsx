import { useMemo } from 'react';
import { currencyMap, CurrencySymbol } from 'src/utils';

export const CurrencyIcon = ({ ccy }: { ccy: CurrencySymbol }) => {
    const Icon = useMemo(() => currencyMap[ccy].icon, [ccy]);
    return <Icon className='h-6 w-6' role='img' />;
};
