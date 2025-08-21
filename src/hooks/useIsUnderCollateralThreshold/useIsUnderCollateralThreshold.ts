import { OrderSide } from '@secured-finance/sf-client';
import { useCallback } from 'react';
import {
    useBorrowableAmount,
    useCurrenciesForOrders,
    useLendingMarkets,
    usePositions,
} from 'src/hooks';
import { UserAccount } from 'src/types';
import { CollateralCalculator, CurrencySymbol } from 'src/utils';

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

            return (
                price < market.currentMinDebtUnitPrice &&
                (position?.lendCurrencies.has(currency) ?? false)
            );
        },
        [markets, address, position?.lendCurrencies]
    );

    return isUnderCollateralThreshold;
};

export const useIsUnderCollateralThresholdForBorrowOrders = (
    address: UserAccount,
    currency: CurrencySymbol
) => {
    const { data: markets } = useLendingMarkets();
    const { data: availableToBorrow } = useBorrowableAmount(address, currency);

    const isUnderCollateralThreshold = useCallback(
        (
            currency: CurrencySymbol,
            maturity: number,
            price: number,
            side: OrderSide,
            amount: bigint
        ) => {
            const market = markets?.[currency]?.[maturity];
            if (!market || !address || !price) return false;

            if (side === OrderSide.LEND) return false;

            const currentMinDebtUnitPrice = market.currentMinDebtUnitPrice;
            const fv = Number((amount * BigInt(10000)) / BigInt(price));
            const requiredCollateral =
                CollateralCalculator.calculateRequiredCollateral(
                    fv,
                    currentMinDebtUnitPrice
                );

            return (
                price < currentMinDebtUnitPrice &&
                requiredCollateral > Number(availableToBorrow)
            );
        },
        [markets, address, availableToBorrow]
    );

    return isUnderCollateralThreshold;
};
