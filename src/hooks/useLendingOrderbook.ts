import {
    useBorrowOrderbookQuery,
    useLendingTradingHistory as useLendingTradingHistoryQuery,
    useLendOrderbookQuery,
} from '@secured-finance/sf-graph-client';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useLendingMarketAddress } from 'src/hooks';
import { Currency } from 'src/utils';
import {
    failSetOrderbook,
    failSetTradingHistory,
    setBorrowOrderbook,
    setLendOrderbook,
    setTradingHistory,
    startSetOrderbook,
    startSetTradingHistory,
    TradingHistoryRow,
} from '../store/lendingTerminal';
import { RootState } from '../store/types';

export const useBorrowOrderbook = (ccy: Currency, term: string, skip = 0) => {
    const lendingMarket = useLendingMarketAddress(ccy, term);

    const filPrice = useSelector(
        (state: RootState) => state.assetPrices.filecoin.price
    );
    const borrowOrderbook = useSelector(
        (state: RootState) => state.lendingTerminal.borrowOrderbook
    );
    const dispatch = useDispatch();
    dispatch(startSetOrderbook());

    const { data, error } = useBorrowOrderbookQuery({
        lendingMarket,
        assetPrice: filPrice,
        skip,
    });

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

export const useLendOrderbook = (ccy: Currency, term: string, skip = 0) => {
    const lendingMarket = useLendingMarketAddress(ccy, term);

    const filPrice = useSelector(
        (state: RootState) => state.assetPrices.filecoin.price
    );
    const lendOrderbook = useSelector(
        (state: RootState) => state.lendingTerminal.lendOrderbook
    );
    const dispatch = useDispatch();
    dispatch(startSetOrderbook());

    const { data, error } = useLendOrderbookQuery({
        lendingMarket,
        assetPrice: filPrice,
        skip,
    });

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
    ccy: Currency,
    term: string,
    skip = 0
) => {
    const lendingMarket = useLendingMarketAddress(ccy, term);

    const tradingHistory = useSelector(
        (state: RootState) => state.lendingTerminal.tradingHistory
    );
    const dispatch = useDispatch();

    dispatch(startSetTradingHistory());
    const { data, error } = useLendingTradingHistoryQuery({
        lendingMarket,
        skip,
    });

    if (error) {
        console.error(error);
    }

    useMemo(() => {
        if (data?.lendingMarket?.tradeHistory) {
            dispatch(
                setTradingHistory(
                    data.lendingMarket
                        .tradeHistory as unknown as TradingHistoryRow[]
                )
            );
        } else {
            dispatch(failSetTradingHistory());
        }
    }, [dispatch, data]);

    return tradingHistory;
};
