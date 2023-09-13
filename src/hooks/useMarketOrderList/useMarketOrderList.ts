import { useMemo } from 'react';
import { CurrencySymbol, currencyMap } from 'src/utils';
import { emptyOrderList, useOrderList } from '../useOrderList';

const passThrough = () => true;

export const useMarketOrderList = (
    account: string | undefined,
    ccy: CurrencySymbol,
    maturity: number,
    filterFn: (
        order: NonNullable<
            ReturnType<typeof useOrderList>['data']
        >['activeOrderList'][0]
    ) => unknown = passThrough
) => {
    const currency = currencyMap[ccy].toCurrency();
    const { data: orderList = emptyOrderList } = useOrderList(account, [
        currency,
    ]);

    return useMemo(() => {
        return orderList.activeOrderList
            .filter(o => o.maturity === maturity.toString())
            .filter(o => filterFn(o));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(orderList), maturity]);
};
