import axios, { AxiosResponse } from "axios"
import { useCallback, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import { fetchAssetPrice, fetchAssetPriceFailure, updateEthUSDChange, updateEthUSDPrice, AssetPrice, updateFilUSDChange, updateFilUSDPrice } from "../store/assetPrices";
import { RootState } from "../store/types";
import useBlock from "./useBlock";

interface ICoinGeckoResponse {
    [key: string]: {
        usd: number,
        usd_24h_change: number,
    }
}

const useAssetPrice = (asset: string, priceAction: (data: number) => void, changeAction: (data: number) => void) => {
    const block = useBlock()
    const reqUrl = "https://api.coingecko.com/api/v3/simple/price?ids="+asset+"&vs_currencies=usd&include_24hr_change=true"
    const dispatch = useDispatch();
    
    const fetchPriceRequest = useCallback(async (isMounted: boolean) => {
        await dispatch(fetchAssetPrice())
        const response: any = await axios.get(reqUrl)
            .then(async (response: AxiosResponse<ICoinGeckoResponse>) => {
                if (response.status === 200) {
                    if (response.data && response.data[asset].usd && response.data[asset].usd_24h_change) {
                        await dispatch(priceAction(response.data[asset].usd))
                        await dispatch(changeAction(response.data[asset].usd_24h_change))
                    }    
                }
            })
            .catch(function (error) {
                dispatch(fetchAssetPriceFailure())
                console.log(error);
            })
    }, [dispatch])

    useEffect(() => {
        let isMounted = true;
        fetchPriceRequest(isMounted)
        return () => { isMounted = false };
    }, [block, dispatch])
}

export const useEthereumUsd = ():AssetPrice => {
    const ethereumUsd = useSelector((state: RootState) => state.assetPrices.ethereum);
    useAssetPrice('ethereum', updateEthUSDPrice, updateEthUSDChange)
    
    return ethereumUsd
}

export const useFilUsd = ():AssetPrice => {
    const filecoinUsd = useSelector((state: RootState) => state.assetPrices.filecoin);
    useAssetPrice('filecoin', updateFilUSDPrice, updateFilUSDChange)
    
    return filecoinUsd
} 
