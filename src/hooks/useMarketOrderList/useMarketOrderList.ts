import { useMemo } from 'react';
import { CurrencySymbol, currencyMap, hexToCurrencySymbol } from 'src/utils';
import { emptyOrderList, useOrderList } from '../useOrderList';

export const useMarketOrderList = (
    account: string | undefined,
    ccy: CurrencySymbol,
    maturity: number
) => {
    const currency = currencyMap[ccy].toCurrency();
    const { data: orderList = emptyOrderList } = useOrderList(account, [
        currency,
    ]);

    return useMemo(() => {
        return orderList.activeOrderList.filter(
            o =>
                hexToCurrencySymbol(o.currency) === ccy &&
                o.maturity === maturity.toString()
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(orderList), maturity]);
};
