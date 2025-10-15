import { OrderSide, WalletSource } from '@secured-finance/sf-client';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { QueryKeys } from 'src/hooks/queries';
import useSF from 'src/hooks/useSecuredFinance';
import {
    selectLandingOrderForm,
    useLandingOrderFormStore,
} from 'src/store/landingOrderForm';
import { ZERO_BI, toCurrency } from 'src/utils';

export const useOrderEstimation = (
    account: string | undefined,
    skip = false
) => {
    const securedFinance = useSF();

    const {
        currency,
        side,
        maturity,
        amount,
        unitPrice,
        isBorrowedCollateral,
        sourceAccount,
    } = selectLandingOrderForm(useLandingOrderFormStore());

    const ignoreBorrowedAmount = useMemo(
        () => (side === OrderSide.BORROW ? isBorrowedCollateral : false),
        [isBorrowedCollateral, side]
    );

    const additionalDepositAmount =
        side === OrderSide.LEND && sourceAccount === WalletSource.METAMASK
            ? amount
            : ZERO_BI;

    return useQuery({
        queryKey: [
            QueryKeys.ORDER_ESTIMATE,
            currency,
            maturity,
            account,
            side,
            amount,
            unitPrice,
            additionalDepositAmount,
            ignoreBorrowedAmount,
        ],
        queryFn: async () => {
            const orderEstimation = await securedFinance?.getOrderEstimation(
                toCurrency(currency),
                maturity,
                account ?? '',
                side,
                amount,
                (unitPrice ?? 0) * 100.0,
                additionalDepositAmount,
                ignoreBorrowedAmount
            );
            return orderEstimation;
        },
        placeholderData: prev => prev,
        enabled: !!securedFinance && !!account && !skip,
    });
};
