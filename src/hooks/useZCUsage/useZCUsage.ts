import { OrderSide } from '@secured-finance/sf-client';
import { useCallback } from 'react';
import { useCurrenciesForOrders, usePositions } from 'src/hooks';
import { UserAccount } from 'src/types';
import { calculate } from 'src/utils';
import { FINANCIAL_CONSTANTS } from 'src/config/constants';
import {
    CurrencySymbol,
    amountFormatterFromBase,
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
                      calculate.abs(pvOfActivePositionsInOrderMaturity),
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

        return Math.min(usage * FINANCIAL_CONSTANTS.BPS_DIVISOR, 8000);
    };

    const getPVInMaturity = useCallback(
        (maturity: number, currency: CurrencySymbol) => {
            const positionInMaturity = position?.positions.find(
                pos =>
                    pos.maturity === maturity.toString() &&
                    hexToCurrencySymbol(pos.currency) === currency
            );

            return amountFormatterFromBase[currency](
                positionInMaturity?.amount ?? BigInt(0)
            );
        },
        [position?.positions]
    );

    return getZCUsage;
};
