import { OrderSide } from '@secured-finance/sf-client';
import { useCallback } from 'react';
import { UserAccount } from 'src/types';
import { CurrencySymbol } from 'src/utils';
import { useCurrenciesForOrders } from '../useCurrenciesForOrders';
import { useLendingMarkets } from '../useLendingMarkets';
import { usePositions } from '../usePositions';

export const useIsUnderCollateralThreshold = (address: UserAccount) => {
    const { data: markets } = useLendingMarkets();
    const { data: usedCurrencies = [] } = useCurrenciesForOrders(address);
    const { data: position } = usePositions(address, usedCurrencies);

    const isUnderCollateralThreshold = useCallback(
        (
            currency: CurrencySymbol,
            maturity: number,
            price: number,
            side: OrderSide
        ) => {
            const market = markets?.[currency]?.[maturity];
            if (!market || !address) return false;
            if (side === OrderSide.LEND) return false;

            if (market.isPreOrderPeriod) {
                return price < market.currentMinDebtUnitPrice;
            }

            // @dev if check involves no active lending positions, either create a new hook for that or remove the position check
            return (
                price < market.currentMinDebtUnitPrice &&
                (position?.lendCurrencies.has(currency) ?? false)
            );
        },
        [markets, address, position?.lendCurrencies]
    );

    return isUnderCollateralThreshold;
};
