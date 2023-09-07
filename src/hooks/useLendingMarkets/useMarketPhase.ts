import { CurrencySymbol } from 'src/utils';
import { useMarket } from './useMarket';

export enum MarketPhase {
    NOT_FOUND = 'Not Found',
    PRE_ORDER = 'Pre Order',
    ITAYOSE = 'Itayose',
    OPEN = 'Open',
    MATURED = 'Matured',
}

export const useMarketPhase = (currency: CurrencySymbol, maturity: number) => {
    const market = useMarket(currency, maturity);
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
};
