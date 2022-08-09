import {
    useOpenOrders as useOpenOrdersHistory,
    useUsersTradingHistoryQuery,
} from '@secured-finance/sf-graph-client';
import { LendingMarketExtendedOrder } from '@secured-finance/sf-graph-client/dist/hooks/user/common';
import { useMemo, useState } from 'react';
import { useLendingMarketAddress } from 'src/hooks';
import { CurrencySymbol } from 'src/utils';
import { useWallet } from 'use-wallet';

export const useOpenOrders = (ccy: CurrencySymbol, term: string) => {
    const { account } = useWallet();
    const lendingMarketAddress = useLendingMarketAddress(ccy, term);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [openOrders, setOpenOrders] = useState<any>([]);
    const { data, error } = useOpenOrdersHistory({
        account: account ? account : '',
        market: lendingMarketAddress,
    });

    if (error) {
        console.error(error);
    }

    useMemo(() => {
        if (data && data.user && data.user.openOrders) {
            setOpenOrders(data.user.openOrders);
        }
    }, [data]);

    return openOrders;
};

export const useTradeHistoryOrders = (ccy: CurrencySymbol, term: string) => {
    const { account } = useWallet();
    const lendingMarketAddress = useLendingMarketAddress(ccy, term);

    const [tradeHistory, setTradeHistory] = useState<
        LendingMarketExtendedOrder[]
    >([]);

    const { data, error } = useUsersTradingHistoryQuery({
        account: account ? account : '',
        market: lendingMarketAddress,
    });

    if (error) {
        console.error(error);
    }

    useMemo(() => {
        if (data) {
            setTradeHistory(data);
        }
    }, [data]);

    return tradeHistory;
};
