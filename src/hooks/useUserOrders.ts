import { utils } from '@secured-finance/sf-client';
import {
    useBilateralPosition,
    useOpenOrders as useOpenOrdersHistory,
    useUsersTradingHistoryQuery,
} from '@secured-finance/sf-graph-client';
import { BilateralPosition } from '@secured-finance/sf-graph-client/dist/.graphclient';
import { useMemo, useState } from 'react';
import { useWallet } from 'use-wallet';

export const useOpenOrders = (ccy: string, term: string) => {
    const { account, chainId }: { account: string; chainId: number | null } =
        useWallet();
    const lendingMarketAddress = utils.getLendingMarketAddressByCcyAndTerm(
        ccy,
        term,
        chainId
    );
    const [openOrders, setOpenOrders] = useState([]);
    const { data, error } = useOpenOrdersHistory(
        account ? account : '',
        lendingMarketAddress
    );

    if (error) {
        console.error(error);
    }

    useMemo(() => {
        if (data !== undefined && data.user !== undefined) {
            setOpenOrders(data.user.openOrders);
        }
    }, [data]);

    return openOrders;
};

export const useBilateralPositionsQuery = () => {
    const { account }: { account: string } = useWallet();

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
    const { account, chainId }: { account: string; chainId: number | null } =
        useWallet();
    const lendingMarketAddress = utils.getLendingMarketAddressByCcyAndTerm(
        ccy,
        term,
        chainId
    );

    const [tradeHistory, setTradeHistory] = useState([]);

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
