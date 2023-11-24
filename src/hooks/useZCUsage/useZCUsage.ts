import { useCallback } from 'react';
import {
    emptyCollateralBook,
    useCollateralBook,
    useCurrenciesForOrders,
    usePositions,
} from 'src/hooks';
import { UserAccount } from 'src/types';
import { CurrencySymbol, amountFormatterFromBase } from 'src/utils';

export const useZCUsage = (address: UserAccount) => {
    const { data: usedCurrencies = [] } = useCurrenciesForOrders(address);
    const { data: position } = usePositions(address, usedCurrencies);
    const { data: collateralBook = emptyCollateralBook } =
        useCollateralBook(address);

    const getZCUsage = (
        maturity: number,
        currency: CurrencySymbol,
        filledAmount: number
    ) => {
        let estimatedBorrowPV = 0;
        let estimatedLendPV = 0;

        if (filledAmount > 0) {
            estimatedLendPV = filledAmount;
        } else {
            estimatedBorrowPV = Math.abs(filledAmount);
        }

        const offsetPV = Math.min(
            getPVInMaturity(maturity, currency),
            filledAmount
        );

        const denominator =
            (position?.totalLendPVPerCurrency[currency] ?? 0) +
            estimatedLendPV -
            offsetPV;

        if (denominator === 0) {
            return 0;
        }

        const usage =
            (((position?.totalBorrowPVPerCurrency[currency] ?? 0) +
                estimatedBorrowPV -
                offsetPV) *
                collateralBook.collateralThreshold) /
            denominator;

        return Math.max(usage, 0);
    };

    const getPVInMaturity = useCallback(
        (maturity: number, currency: CurrencySymbol) => {
            const positionInMaturity = position?.positions.find(
                pos =>
                    pos.maturity === maturity.toString() &&
                    pos.currency === currency
            );

            return amountFormatterFromBase[currency](
                positionInMaturity?.amount ?? BigInt(0)
            );
        },
        [position?.positions]
    );

    return getZCUsage;
};
