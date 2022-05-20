import { utils } from '@secured-finance/sf-client';
import {
    useBorrowOrderbook as useBorrowOrderbookQuery,
    useLendingTradingHistory as useLendingTradingHistoryQuery,
    useLendOrderbook as useLendOrderbookQuery,
} from '@secured-finance/sf-graph-client';
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
    try {
        const res = useBorrowOrderbookQuery(lendingMarket, filPrice, skip);
        if (res != null) {
            dispatch(setBorrowOrderbook(res));
        }
    } catch (err) {
        dispatch(failSetOrderbook());
        console.error(err);
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
        console.error(err);
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
        console.error(err);
    }

    return tradingHistory;
};
