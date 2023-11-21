import { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { getPriceMap } from 'src/store/assetPrices/selectors';
import { RootState } from 'src/store/types';
import { UserAccount } from 'src/types';
import {
    CurrencySymbol,
    amountFormatterFromBase,
    hexToCurrencySymbol,
} from 'src/utils';
import { emptyCollateralBook, useCollateralBook } from '../useCollateralBook';
import { useCurrenciesForOrders } from '../useCurrenciesForOrders';
import { usePositions } from '../usePositions';

export const useZCUsage = (address: UserAccount) => {
    const { data: usedCurrencies = [] } = useCurrenciesForOrders(address);
    const { data: position } = usePositions(address, usedCurrencies);
    const { data: collateralBook = emptyCollateralBook } =
        useCollateralBook(address);
    const assetPriceMap = useSelector((state: RootState) => getPriceMap(state));

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
            estimatedBorrowPV = filledAmount;
        }

        const offsetPV = Math.min(
            getPVInMaturity(maturity, currency),
            filledAmount
        );

        const denominator =
            (position?.totalLendPV ?? 0) + estimatedLendPV - offsetPV;

        if (denominator === 0) {
            return 0;
        }

        const usage =
            (((position?.totalBorrowPV ?? 0) + estimatedBorrowPV - offsetPV) *
                collateralBook.collateralThreshold) /
            denominator;

        return usage;
    };

    const getPVInMaturity = useCallback(
        (maturity: number, currency: CurrencySymbol) => {
            const positionInMaturity = position?.positions.find(
                pos => pos.maturity === maturity.toString()
            );

            if (positionInMaturity) {
                const formattedAmount = amountFormatterFromBase[currency](
                    positionInMaturity.amount
                );

                const positionCcy = hexToCurrencySymbol(
                    positionInMaturity.currency
                );

                if (!positionCcy) {
                    return 0;
                }

                return (
                    (formattedAmount * assetPriceMap[positionCcy]) /
                    assetPriceMap[currency]
                );
            }
            return 0;
        },
        [assetPriceMap, position?.positions]
    );

    return getZCUsage;
};
