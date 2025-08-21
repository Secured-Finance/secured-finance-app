import { OrderSide } from '@secured-finance/sf-client';
import { useCallback } from 'react';
import { useCurrenciesForOrders, usePositions } from 'src/hooks';
import { UserAccount } from 'src/types';
import {
    AmountConverter,
    CurrencySymbol,
    hexToCurrencySymbol,
} from 'src/utils';

export const useZCUsage = (address: UserAccount, side: OrderSide) => {
    const { data: usedCurrencies = [] } = useCurrenciesForOrders(address);
    const { data: position } = usePositions(address, usedCurrencies);

    const getZCUsage = (
        maturity: number,
        currency: CurrencySymbol,
        filledAmount: number
    ) => {
        let estimatedBorrowPV = 0;
        let estimatedLendPV = 0;

        if (side === OrderSide.LEND) {
            estimatedLendPV = filledAmount;
        } else {
            estimatedBorrowPV = filledAmount;
        }

        const pvOfActivePositionsInOrderMaturity = getPVInMaturity(
            maturity,
            currency
        );

        const offsetPV =
            (pvOfActivePositionsInOrderMaturity > 0 &&
                side === OrderSide.BORROW) ||
            (pvOfActivePositionsInOrderMaturity < 0 && side === OrderSide.LEND)
                ? Math.min(
                      Math.abs(pvOfActivePositionsInOrderMaturity),
                      filledAmount
                  )
                : 0;

        const denominator =
            (position?.totalLendPVPerCurrency[currency] ?? 0) +
            estimatedLendPV -
            offsetPV;

        if (denominator === 0) {
            return 0;
        }

        const usage =
            ((position?.totalBorrowPVPerCurrency[currency] ?? 0) +
                estimatedBorrowPV -
                offsetPV) /
            denominator;

        return Math.min(usage * 10000, 8000);
    };

    const getPVInMaturity = useCallback(
        (maturity: number, currency: CurrencySymbol) => {
            const positionInMaturity = position?.positions.find(
                pos =>
                    pos.maturity === maturity.toString() &&
                    hexToCurrencySymbol(pos.currency) === currency
            );

            return AmountConverter.fromBase(
                positionInMaturity?.amount ?? BigInt(0),
                currency
            );
        },
        [position?.positions]
    );

    return getZCUsage;
};
