import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux"
import { useWallet } from 'use-wallet'

import useSF from './useSecuredFinance'
import useBlock from './useBlock'
import { RootState } from '../store/types'
import { client, LENDING_BORROW_ORDERBOOK, LENDING_LEND_ORDERBOOK, LENDING_MARKET_INFO, LENDING_TRADING_HISTORY } from '../services/apollo'
import { getLendingMarketAddress } from '../services/sdk/utils'
import { failSetOrderbook, failSetTradingHistory, OrderbookRow, setBorrowOrderbook, setLendOrderbook, setTradingHistory, startSetOrderbook, startSetTradingHistory } from '../store/lendingTerminal'
import BigNumber from 'bignumber.js'

export const useBorrowOrderbook = (ccy: number, term: number, skip: number = 0) => {
	const { account }: { account: string } = useWallet()
    const block = useBlock()
	const securedFinance = useSF()
	const lendingMarket = getLendingMarketAddress(securedFinance, ccy, term)

    const filPrice = useSelector((state: RootState) => state.assetPrices.filecoin.price)
    const borrowOrderbook = useSelector((state: RootState) => state.lendingTerminal.borrowOrderbook)
    const dispatch = useDispatch()

    const fetchBorrowOrderbook = useCallback(async () => {
        dispatch(startSetOrderbook())
        try {
            let res = await client.query({
                query: LENDING_BORROW_ORDERBOOK,
                variables: {
                    market: lendingMarket.toLowerCase(),
                    skip: skip,
                },
                fetchPolicy: 'cache-first',
            })
            if (res?.data.lendingMarket.borrowOrderbook) {
                let parsedOrderbook: Array<OrderbookRow> = []
                res.data.lendingMarket.borrowOrderbook.map(function(item: any, index: number){
                    const usdAmount = new BigNumber(res.data.lendingMarket.borrowOrderbook[index].totalAmount).multipliedBy(filPrice).toNumber()
                    const orderbookItem = Object.assign({}, res.data.lendingMarket.borrowOrderbook[index], {"usdAmount": usdAmount})
                    parsedOrderbook.push(orderbookItem)
                })
                await dispatch(setBorrowOrderbook(parsedOrderbook))
            }
        }
        catch (err) {
            dispatch(failSetOrderbook())
            console.log(err)
        }
	}, [dispatch, securedFinance, block, lendingMarket, account])
    
	useEffect(() => {
        let isMounted = true;
		if (securedFinance && account) {
			fetchBorrowOrderbook()
        }
        return () => { isMounted = false };
	}, [dispatch, securedFinance, block, lendingMarket, account])

    return borrowOrderbook
}

export const useLendOrderbook = (ccy: number, term: number, skip: number = 0) => {
	const { account }: { account: string } = useWallet()
    const block = useBlock()
	const securedFinance = useSF()
	const lendingMarket = getLendingMarketAddress(securedFinance, ccy, term)

    const filPrice = useSelector((state: RootState) => state.assetPrices.filecoin.price)
    const lendOrderbook = useSelector((state: RootState) => state.lendingTerminal.lendOrderbook)
    const dispatch = useDispatch()

    const fetchLendOrderbook = useCallback(async () => {
        dispatch(startSetOrderbook())
        try {
            let res = await client.query({
                query: LENDING_LEND_ORDERBOOK,
                variables: {
                    market: lendingMarket.toLowerCase(),
                    skip: skip,
                },
                fetchPolicy: 'cache-first',
            })
            if (res?.data.lendingMarket.lendOrderbook) {
                let parsedOrderbook: Array<OrderbookRow> = []
                res.data.lendingMarket.lendOrderbook.map(function(item: any, index: number){
                    const usdAmount = new BigNumber(res.data.lendingMarket.lendOrderbook[index].totalAmount).multipliedBy(filPrice).toNumber()
                    const orderbookItem = Object.assign({}, res.data.lendingMarket.lendOrderbook[index], {"usdAmount": usdAmount})
                    parsedOrderbook.push(orderbookItem)
                })
                await dispatch(setLendOrderbook(parsedOrderbook))
            }
        }
        catch (err) {
            dispatch(failSetOrderbook())
            console.log(err)
        }
	}, [dispatch, securedFinance, block, lendingMarket, account])
    
	useEffect(() => {
        let isMounted = true;
		if (securedFinance && account) {
			fetchLendOrderbook()
        }
        return () => { isMounted = false };
	}, [dispatch, securedFinance, block, lendingMarket, account])

    return lendOrderbook
}

export const useLendingTradingHistory = (ccy: number, term: number, skip: number = 0) => {
	const { account }: { account: string } = useWallet()
    const block = useBlock()
	const securedFinance = useSF()
	const lendingMarket = getLendingMarketAddress(securedFinance, ccy, term)
    const tradingHistory = useSelector((state: RootState) => state.lendingTerminal.tradingHistory)
    const dispatch = useDispatch()

    const fetchLendingTradingHistory = useCallback(async () => {
        dispatch(startSetTradingHistory())
        try {
            let res = await client.query({
                query: LENDING_TRADING_HISTORY,
                variables: {
                    market: lendingMarket.toLowerCase(),
                    skip: skip,
                },
                fetchPolicy: 'cache-first',
            })
            if (res?.data.lendingMarket.tradeHistory) {    
                await dispatch(setTradingHistory(res.data.lendingMarket.tradeHistory))
            }
        }
        catch (err) {
            dispatch(failSetTradingHistory())
            console.log(err)
        }
	}, [dispatch, securedFinance, block, lendingMarket, account])
    
	useEffect(() => {
        let isMounted = true;
		if (securedFinance && account) {
			fetchLendingTradingHistory()
        }
        return () => { isMounted = false };
	}, [dispatch, securedFinance, block, lendingMarket, account])

    return tradingHistory
}
