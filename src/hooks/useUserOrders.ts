import { utils } from '@secured-finance/sf-client';
import {
    useBilateralPosition,
    useOpenOrders as useOpenOrdersHistory,
    useUsersTradingHistoryQuery,
} from '@secured-finance/sf-graph-client';
import { BilateralPosition } from '@secured-finance/sf-graph-client/dist/.graphclient';
import { LendingMarketExtendedOrder } from '@secured-finance/sf-graph-client/dist/hooks/user/common';
import { useMemo, useState } from 'react';
import { useWallet } from 'use-wallet';

export const useOpenOrders = (ccy: string, term: string) => {
    const { account, chainId } = useWallet();
    const lendingMarketAddress = utils.getLendingMarketAddressByCcyAndTerm(
        ccy,
        term,
        chainId ? chainId : 1
    );

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [openOrders, setOpenOrders] = useState<any>([]);
    const { data, error } = useOpenOrdersHistory(
        account ? account : '',
        lendingMarketAddress
    );

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

export const useBilateralPositionsQuery = () => {
    const { account } = useWallet();

    const [positions, setPositions] = useState<Array<BilateralPosition>>([]);
    const { data, error } = useBilateralPosition(account ? account : '');

    if (error) {
        console.error(error);
    }

    useMemo(() => {
        if (data?.bilateralPositions) {
            setPositions(data.bilateralPositions as Array<BilateralPosition>);
        }
    }, [data]);

    return positions;
};

export const useTradeHistoryOrders = (ccy: string, term: string) => {
    const { account, chainId } = useWallet();
    const lendingMarketAddress = utils.getLendingMarketAddressByCcyAndTerm(
        ccy,
        term,
        chainId ? chainId : 1
    );

    const [tradeHistory, setTradeHistory] = useState<
        LendingMarketExtendedOrder[]
    >([]);

    const { data, error } = useUsersTradingHistoryQuery(
        account ? account : '',
        lendingMarketAddress
    );

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
