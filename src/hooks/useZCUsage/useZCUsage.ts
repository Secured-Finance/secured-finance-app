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
import { useOrderEstimation } from '../useOrderEstimation';
import { usePositions } from '../usePositions';

export const useZCUsage = (address: UserAccount) => {
    const { data: usedCurrencies = [] } = useCurrenciesForOrders(address);
    const { data: position } = usePositions(address, usedCurrencies);
    const { data: collateralBook = emptyCollateralBook } =
        useCollateralBook(address);
    const { data: orderEstimationInfo } = useOrderEstimation(address);
    const assetPriceMap = useSelector((state: RootState) => getPriceMap(state));

    const getZCUsage = (
        maturity: number,
        currency: CurrencySymbol,
        amount: number
    ) => {
        let estimatedBorrowPV = 0;
        let estimatedLendPV = 0;

        const filledAmount = amountFormatterFromBase[currency](
            orderEstimationInfo?.filledAmount ?? BigInt(0)
        );

        if (filledAmount > 0) {
            estimatedLendPV = filledAmount;
        } else {
            estimatedBorrowPV = filledAmount;
        }

        const offsetPV = Math.min(getZCOffsetPV(maturity, currency), amount);

        const usage =
            ((position?.totalBorrowPV ?? 0 + estimatedBorrowPV - offsetPV) *
                collateralBook.collateralThreshold) /
            (position?.totalLendPV ?? 0 + estimatedLendPV - offsetPV);

        return usage;
    };

    const getZCOffsetPV = useCallback(
        (maturity: number, currency: CurrencySymbol) => {
            const offsetPV = position?.positions.reduce((prev, pos) => {
                if (pos.maturity === maturity.toString()) {
                    const ccy = hexToCurrencySymbol(pos.currency);
                    if (ccy) {
                        prev +=
                            amountFormatterFromBase[ccy](pos.amount) *
                            assetPriceMap[ccy];
                    }
                }
                return prev;
            }, 0);

            return (offsetPV ?? 0) / assetPriceMap[currency];
        },
        [assetPriceMap, position?.positions]
    );

    return getZCUsage;
};
