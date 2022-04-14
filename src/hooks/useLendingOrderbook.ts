import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useWallet } from 'use-wallet';
import { RootState } from '../store/types';
import {
    failSetOrderbook,
    failSetTradingHistory,
    setBorrowOrderbook,
    setLendOrderbook,
    setTradingHistory,
    startSetOrderbook,
    startSetTradingHistory,
} from '../store/lendingTerminal';
import { utils } from '@secured-finance/sf-client';
import {
    useLendOrderbook as useLendOrderbookQuery,
    useBorrowOrderbook as useBorrowOrderbookQuery,
    useLendingTradingHistory as useLendingTradingHistoryQuery,
} from '@secured-finance/sf-graph-client';

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
    try {
        const res = useBorrowOrderbookQuery(lendingMarket, filPrice, skip);
        if (res != null) {
            dispatch(setBorrowOrderbook(res));
        }
    } catch (err) {
        dispatch(failSetOrderbook());
        console.log(err);
    }

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
    try {
        const res = useLendOrderbookQuery(lendingMarket, filPrice, skip);
        if (res != null) {
            dispatch(setLendOrderbook(res));
        }
    } catch (err) {
        dispatch(failSetOrderbook());
        console.log(err);
    }

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
    try {
        const res = useLendingTradingHistoryQuery(lendingMarket, skip);
        if (res != null) {
            dispatch(setTradingHistory(res));
        }
    } catch (err) {
        dispatch(failSetTradingHistory());
        console.log(err);
    }

    return tradingHistory;
};
