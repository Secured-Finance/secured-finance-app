import axios, { AxiosResponse } from 'axios';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    updateEthUSDChange,
    updateEthUSDPrice,
    updateFilUSDChange,
    updateFilUSDPrice,
} from '../store/assetPrices';
import { RootState } from '../store/types';

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
    const block = useSelector(
        (state: RootState) => state.blockchain.latestBlock
    );

    const dispatch = useDispatch();

    const fetchPriceRequest = useCallback(async () => {
        const reqUrl =
            'https://api.coingecko.com/api/v3/simple/price?ids=' +
            asset +
            '&vs_currencies=usd&include_24hr_change=true';

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
                console.error(error);
            });
    }, [asset, changeAction, dispatch, priceAction]);

    useEffect(() => {
        fetchPriceRequest();
    }, [block, dispatch, fetchPriceRequest]);
};

export const useWatchEthereumUsdPrice = () => {
    useAssetPrice('ethereum', updateEthUSDPrice, updateEthUSDChange);
};

export const useWatchFilecoinUsdPrice = () => {
    useAssetPrice('filecoin', updateFilUSDPrice, updateFilUSDChange);
};
