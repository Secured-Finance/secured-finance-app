import BigNumber from 'bignumber.js'
import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useWallet } from 'use-wallet'
import { provider } from 'web3-core'
import WalletAccountModal from '../components/WalletAccountModal'
import { RootState } from '../store/types'
import { fetchWallet, fetchWalletFailure, updateEthWalletActions, updateEthWalletAddress, updateEthWalletAssetPrice, updateEthWalletBalance, updateEthWalletDailyChange, updateEthWalletPortfolioShare, updateEthWalletUSDBalance } from '../store/wallets'
import { useEthereumUsd } from './useAssetPrices'

import useBlock from './useBlock'
import useModal from './useModal'
import { useTotalUSDBalance } from './useTotalUSDBalance'

const useEthWalletStoreAction = (action: (data: any) => void, data: any) => {
    const { account, balance, ethereum }: { account: string; balance: string; ethereum: provider } = useWallet()
    const block = useBlock()
    const dispatch = useDispatch();
    
    const fetchEthStore = useCallback(async (isMounted: boolean) => {
        await dispatch(fetchWallet())
        if (account && ethereum && balance && data != null && data != Infinity) {
            dispatch(action(data))
        } else {
            dispatch(fetchWalletFailure())
        }
	}, [dispatch, account, ethereum, balance])
    
	useEffect(() => {
        let isMounted = true;
        fetchEthStore(isMounted)
        return () => { isMounted = false };
    }, [block, dispatch])
}

export const useEthereumAddress = () => {
    const { account}: { account: string } = useWallet()
    const ethereumAddress = useSelector((state: RootState) => state.wallets.ethereum.address);
    useEthWalletStoreAction(updateEthWalletAddress, account)
    
    return ethereumAddress
}

export const useEthereumBalance = () => {
    const { balance }: { balance: string } = useWallet()
    const inEth = new BigNumber(balance).dividedBy(new BigNumber(10).pow(18)).toNumber()
    const ethereumBalance = useSelector((state: RootState) => state.wallets.ethereum.balance);
    useEthWalletStoreAction(updateEthWalletBalance, inEth)
    
    return ethereumBalance
}

export const useEthereumUSDBalance = () => {
    const { balance }: { balance: string } = useWallet()
    const ethereumUSDBalance = useSelector((state: RootState) => state.wallets.ethereum.usdBalance);
    const ethPrice = useSelector((state: RootState) => state.assetPrices.ethereum.price);
    const inEth = new BigNumber(balance).dividedBy(new BigNumber(10).pow(18)).toNumber()
    let usdBalance = new BigNumber(inEth).times(new BigNumber(ethPrice)).toNumber()
    useEthWalletStoreAction(updateEthWalletUSDBalance, usdBalance)
    
    return ethereumUSDBalance
}

export const useEthereumUSDPrice = () => {
    const ethereumUSDPrice = useSelector((state: RootState) => state.wallets.ethereum.assetPrice);
    const ethUSDPrice = useSelector((state: RootState) => state.assetPrices.ethereum.price);
    useEthWalletStoreAction(updateEthWalletAssetPrice, ethUSDPrice)
    
    return ethereumUSDPrice
}

export const useEthereumDailyChange = () => {
    const ethereumDailyChange = useSelector((state: RootState) => state.wallets.ethereum.dailyChange);
    const ethChange = useSelector((state: RootState) => state.assetPrices.ethereum.change);
    useEthWalletStoreAction(updateEthWalletDailyChange, ethChange)
    
    return ethereumDailyChange
}


export const useEthereumActions = () => {
    const { reset } = useWallet()
    const ethereumActions = useSelector((state: RootState) => state.wallets.ethereum.actions);
    const [onPresentAccountModal] = useModal(WalletAccountModal)

    const actObj = {
        send: onPresentAccountModal,
        placeCollateral: onPresentAccountModal,
        signOut: reset,
    }
    useEthWalletStoreAction(updateEthWalletActions, actObj)
    
    return ethereumActions
}

export const useEthereumPortfolioShare = () => {
    const block = useBlock()
    const dispatch = useDispatch();
    const { balance }: { balance: string } = useWallet()
    const ethereumShare = useSelector((state: RootState) => state.wallets.ethereum.portfolioShare);
    const totalUSDBalance = useTotalUSDBalance()
    const ethPrice = useSelector((state: RootState) => state.assetPrices.ethereum.price);
    const inEther = new BigNumber(balance).dividedBy(new BigNumber(10).pow(18)).toNumber()
    let usdBalance = new BigNumber(inEther).times(new BigNumber(ethPrice)).toNumber()

    const portfolioShare = new BigNumber(usdBalance).times(100).dividedBy(new BigNumber(totalUSDBalance)).toNumber()
    useEthWalletStoreAction(updateEthWalletPortfolioShare, portfolioShare)
    
    const fetchEthStore = useCallback(async (isMounted: boolean) => {
        await dispatch(fetchWallet())
        if ( balance && totalUSDBalance && ethPrice && portfolioShare != null && portfolioShare != Infinity) {
            dispatch(updateEthWalletPortfolioShare(portfolioShare))
        } else {
            dispatch(fetchWalletFailure())
        }
	}, [dispatch, balance, totalUSDBalance, ethPrice, portfolioShare, usdBalance])
    
	useEffect(() => {
        let isMounted = true;
        fetchEthStore(isMounted)
        return () => { isMounted = false };
    }, [block, dispatch])

    return ethereumShare
}

export const useEthereumWalletStore = () => {
    const ethWallet = useSelector((state: RootState) => state.wallets.ethereum);
    useEthereumUsd()
    useTotalUSDBalance()
    useEthereumAddress()
    useEthereumBalance()
    useEthereumUSDBalance()
    useEthereumUSDPrice()
    useEthereumDailyChange()
    useEthereumPortfolioShare()
    useEthereumActions()

    return ethWallet
}