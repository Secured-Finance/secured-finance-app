import { useCallback, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { useWallet } from 'use-wallet'

import { getCollateralContract, getCollateralBook } from '../services/sdk/utils'
import useSF from './useSecuredFinance'
import useBlock from './useBlock'
import { RootState } from '../store/types';

const useCollateralBook = () => {
    const { account}: { account: string } = useWallet()
    const securedFinance = useSF()
    const block = useBlock()
    const collateralContract = getCollateralContract(securedFinance)
    const dispatch = useDispatch();  
    
    const fetchCollateralBook = useCallback(async () => {
        const book = await getCollateralBook(collateralContract, account)
        console.log(book)
	}, [dispatch, collateralContract, account])
    
	useEffect(() => {
        let isMounted = true;
		if (securedFinance && collateralContract && account) {
			fetchCollateralBook()
        }
        return () => { isMounted = false };
	}, [block, collateralContract, dispatch, securedFinance, account])
}

export default useCollateralBook