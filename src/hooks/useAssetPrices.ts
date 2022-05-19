import axios, { AxiosResponse } from 'axios';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    AssetPrice,
    fetchAssetPrice,
    fetchAssetPriceFailure,
    updateEthUSDChange,
    updateEthUSDPrice,
    updateFilUSDChange,
    updateFilUSDPrice,
    updateUSDCUSDChange,
    updateUSDCUSDPrice,
} from '../store/assetPrices';
import { RootState } from '../store/types';
import useBlock from './useBlock';

interface ICoinGeckoResponse {
    [key: string]: {
        usd: number;
        usd_24h_change: number;
    };
}

const useAssetPrice = (
    asset: string,
    priceAction: (data: number) => void,
    changeAction: (data: number) => void
) => {
    const block = useBlock();

    const dispatch = useDispatch();

    const fetchPriceRequest = useCallback(async () => {
        const reqUrl =
            'https://api.coingecko.com/api/v3/simple/price?ids=' +
            asset +
            '&vs_currencies=usd&include_24hr_change=true';
        dispatch(fetchAssetPrice());
        await axios
            .get(reqUrl)
            .then(async (response: AxiosResponse<ICoinGeckoResponse>) => {
                if (response.status === 200) {
                    if (
                        response.data &&
                        response.data[asset].usd &&
                        response.data[asset].usd_24h_change
                    ) {
                        dispatch(
                            priceAction(
                                Number(response.data[asset].usd.toFixed(2))
                            )
                        );
                        dispatch(
                            changeAction(response.data[asset].usd_24h_change)
                        );
                    }
                }
            })
            .catch(function (error) {
                dispatch(fetchAssetPriceFailure());
                console.error(error);
            });
    }, [asset, changeAction, dispatch, priceAction]);

    useEffect(() => {
        fetchPriceRequest();
    }, [block, dispatch, fetchPriceRequest]);
};

export const useEthereumUsd = (): AssetPrice => {
    const ethereumUsd = useSelector(
        (state: RootState) => state.assetPrices.ethereum
    );
    useAssetPrice('ethereum', updateEthUSDPrice, updateEthUSDChange);

    return ethereumUsd;
};

export const useFilUsd = (): AssetPrice => {
    const filecoinUsd = useSelector(
        (state: RootState) => state.assetPrices.filecoin
    );
    useAssetPrice('filecoin', updateFilUSDPrice, updateFilUSDChange);

    return filecoinUsd;
};

export const useUSDCUsd = (): AssetPrice => {
    const USDCUsd = useSelector((state: RootState) => state.assetPrices.usdc);
    useAssetPrice('usd-coin', updateUSDCUSDPrice, updateUSDCUSDChange);

    return USDCUsd;
};
