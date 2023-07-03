import { createSelector } from '@reduxjs/toolkit';
import { CurrencySymbol } from 'src/utils';
import { RootState } from '../types';

export enum MarketPhase {
    NOT_FOUND = 'Not Found',
    PRE_ORDER = 'Pre Order',
    ITAYOSE = 'Itayose',
    OPEN = 'Open',
    MATURED = 'Matured',
}

export const selectMarket =
    (currency: CurrencySymbol, maturity: number) => (state: RootState) => {
        return state.availableContracts.lendingMarkets[currency][maturity];
    };

export const selectMarketPhase = (currency: CurrencySymbol, maturity: number) =>
    createSelector(selectMarket(currency, maturity), market => {
        if (!market) {
            return MarketPhase.NOT_FOUND;
        }

        if (market.isPreOrderPeriod) {
            return MarketPhase.PRE_ORDER;
        }

        if (market.isItayosePeriod) {
            return MarketPhase.ITAYOSE;
        }

        if (market.isOpened) {
            return MarketPhase.OPEN;
        }

        if (market.isMatured) {
            return MarketPhase.MATURED;
        }

        return MarketPhase.NOT_FOUND;
    });
