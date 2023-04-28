import { SecuredFinanceClient } from '@secured-finance/sf-client';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useMarket } from 'src/hooks';
import {
    selectLandingOrderForm,
    setMarketPhase,
} from 'src/store/landingOrderForm';
import { RootState } from 'src/store/types';

export const useMarketPhase = (
    securedFinance: SecuredFinanceClient | undefined
) => {
    const { currency, maturity } = useSelector((state: RootState) =>
        selectLandingOrderForm(state.landingOrderForm)
    );
    const market = useMarket(currency, maturity, securedFinance);
    const dispatch = useDispatch();

    useEffect(() => {
        if (market?.isItayosePeriod) {
            dispatch(setMarketPhase('Itayose'));
        } else if (market?.isPreOrderPeriod) {
            dispatch(setMarketPhase('PreOrder'));
        } else if (market?.isOpened) {
            dispatch(setMarketPhase('Open'));
        } else {
            dispatch(setMarketPhase('Closed'));
        }
    }, [
        dispatch,
        market?.isItayosePeriod,
        market?.isOpened,
        market?.isPreOrderPeriod,
    ]);
};
