import { useCallback, useEffect, useState } from 'react'
import { useWallet } from 'use-wallet'
import { client } from '../services/apollo'
import { TRADE_HISTORY, OPEN_ORDERS, OPEN_LOANS } from '../services/apollo/userQueries'
import { getLendingMarketAddress } from '../services/sdk/utils'
import useSF from './useSecuredFinance'

export const useOpenOrders = (ccy: number, term: number) => {
    const securedFinance = useSF()
	const { account }: { account: string } = useWallet()
	const lendingMarket = getLendingMarketAddress(securedFinance, ccy, term)

    const [openOrders, setOpenOrders] = useState([])

    const fetchOpenOrders = useCallback(async () => {
        let res = await client.query({
            query: OPEN_ORDERS,
            variables: {
                account: account.toLowerCase(),
                market: lendingMarket,
            },
            fetchPolicy: 'cache-first',
        })
        try {
            if (res?.data.user.openOrders) {
                setOpenOrders(res.data.user.openOrders)
            }
        }
        catch (err) {
            console.log(err)
        }
	}, [ccy, term, lendingMarket, account])
    
	useEffect(() => {
        let isMounted = true;
		if (lendingMarket != null && account) {
			fetchOpenOrders()
        }
        return () => { isMounted = false };
	}, [ccy, term, lendingMarket, account])
    
	return openOrders
}

export const useTradeHistoryOrders = (ccy: number, term: number) => {
    const securedFinance = useSF()
	const { account }: { account: string } = useWallet()
	const lendingMarket = getLendingMarketAddress(securedFinance, ccy, term)

    const [tradeHistory, setTradeHistory] = useState([])

    const fetchTradeHistoryOrders = useCallback(async () => {
        let res = await client.query({
            query: TRADE_HISTORY,
            variables: {
                account: account.toLowerCase(),
                market: lendingMarket,
            },
            fetchPolicy: 'cache-first',
        })
        try {
            if (res?.data.user.madeOrders && res?.data.user.takenOrders) {
                let parsedHistory: Array<any> = []

                res.data.user.madeOrders.map(function(item: any, index: number){
                    const counterparty = res.data.user.madeOrders[index].taker
                    const historyItem = Object.assign({}, res.data.user.madeOrders[index], {"counterparty": counterparty})
                    parsedHistory.push(historyItem)
                })

                res.data.user.takenOrders.map(function(item: any, index: number){
                    const counterparty = res.data.user.takenOrders[index].maker
                    const historyItem = Object.assign({}, res.data.user.takenOrders[index], {"counterparty": counterparty})
                    parsedHistory.push(historyItem)
                })

                parsedHistory.sort(function(x, y){
                    return y.createdAtTimestamp - x.createdAtTimestamp;
                })

                setTradeHistory(parsedHistory)
            }
        }
        catch (err) {
            console.log(err)
        }
	}, [ccy, term, lendingMarket, account])
    
	useEffect(() => {
        let isMounted = true;
		if (lendingMarket != null && account) {
			fetchTradeHistoryOrders()
        }
        return () => { isMounted = false };
	}, [ccy, term, lendingMarket, account])
    
	return tradeHistory
}

export const useOpenLoans = (ccy: number, term: number) => {
    const securedFinance = useSF()
	const { account }: { account: string } = useWallet()
	const lendingMarket = getLendingMarketAddress(securedFinance, ccy, term)

    const [loans, setLoans] = useState([])

    const fetchMadeOrders = useCallback(async () => {
        let res = await client.query({
            query: OPEN_LOANS,
            variables: {
                account: account.toLowerCase(),
                market: lendingMarket,
            },
            fetchPolicy: 'cache-first',
        })
        try {
            if (res?.data.user.loans) {
                console.log(res?.data.user.loans)
                setLoans(res.data.user.loans)
            }
        }
        catch (err) {
            console.log(err)
        }
	}, [ccy, term, lendingMarket, account])
    
	useEffect(() => {
        let isMounted = true;
		if (lendingMarket != null && account) {
			fetchMadeOrders()
        }
        return () => { isMounted = false };
	}, [ccy, term, lendingMarket, account])
    
	return loans
}
