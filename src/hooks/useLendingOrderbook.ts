import { utils } from '@secured-finance/sf-client';
import {
    useBorrowOrderbookQuery,
    useLendingTradingHistory as useLendingTradingHistoryQuery,
    useLendOrderbookQuery,
} from '@secured-finance/sf-graph-client';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useWallet } from 'use-wallet';
import {
    failSetOrderbook,
    failSetTradingHistory,
    setBorrowOrderbook,
    setLendOrderbook,
    setTradingHistory,
    startSetOrderbook,
    startSetTradingHistory,
} from '../store/lendingTerminal';
import { RootState } from '../store/types';

export const useBorrowOrderbook = (ccy: string, term: string, skip = 0) => {
    const { chainId }: { chainId: number | null } = useWallet();
    const lendingMarket = utils.getLendingMarketAddressByCcyAndTerm(
        ccy,
        term,
        chainId
    );

    const filPrice = useSelector(
        (state: RootState) => state.assetPrices.filecoin.price
    );
    const borrowOrderbook = useSelector(
        (state: RootState) => state.lendingTerminal.borrowOrderbook
    );
    const dispatch = useDispatch();
    dispatch(startSetOrderbook());

    const { data, error } = useBorrowOrderbookQuery(
        lendingMarket,
        filPrice,
        skip
    );

    if (error) {
        console.error(error);
    }

    useMemo(() => {
        if (data) {
            dispatch(setBorrowOrderbook(data));
        } else {
            dispatch(failSetOrderbook());
        }
    }, [data, dispatch]);

    return borrowOrderbook;
};

export const useLendOrderbook = (ccy: string, term: string, skip = 0) => {
    const { chainId }: { chainId: number | null } = useWallet();
    const lendingMarket = utils.getLendingMarketAddressByCcyAndTerm(
        ccy,
        term,
        chainId
    );

    const filPrice = useSelector(
        (state: RootState) => state.assetPrices.filecoin.price
    );
    const lendOrderbook = useSelector(
        (state: RootState) => state.lendingTerminal.lendOrderbook
    );
    const dispatch = useDispatch();
    dispatch(startSetOrderbook());

    const { data, error } = useLendOrderbookQuery(
        lendingMarket,
        filPrice,
        skip
    );

    if (error) {
        console.error(error);
    }

    useMemo(() => {
        if (data) {
            dispatch(setLendOrderbook(data));
        } else {
            dispatch(failSetOrderbook());
        }
    }, [data, dispatch]);

    return lendOrderbook;
};

export const useLendingTradingHistory = (
    ccy: string,
    term: string,
    skip = 0
) => {
    const { chainId }: { chainId: number | null } = useWallet();
    const lendingMarket = utils.getLendingMarketAddressByCcyAndTerm(
        ccy,
        term,
        chainId
    );
    const tradingHistory = useSelector(
        (state: RootState) => state.lendingTerminal.tradingHistory
    );
    const dispatch = useDispatch();

    dispatch(startSetTradingHistory());
    const { data, error } = useLendingTradingHistoryQuery(lendingMarket, skip);

    if (error) {
        console.error(error);
    }

    useMemo(() => {
        if (data) {
            dispatch(setTradingHistory(data));
        } else {
            dispatch(failSetTradingHistory());
        }
    }, [dispatch, data]);

    return tradingHistory;
};
