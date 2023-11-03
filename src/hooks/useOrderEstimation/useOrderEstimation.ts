import { OrderSide, WalletSource } from '@secured-finance/sf-client';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { QueryKeys } from 'src/hooks/queries';
import useSF from 'src/hooks/useSecuredFinance';
import { selectLandingOrderForm } from 'src/store/landingOrderForm';
import { RootState } from 'src/store/types';
import { ZERO_BI, toCurrency } from 'src/utils';

export const useOrderEstimation = (account: string | undefined) => {
    const securedFinance = useSF();

    const {
        currency,
        side,
        maturity,
        amount,
        unitPrice,
        isBorrowedCollateral,
        sourceAccount,
    } = useSelector((state: RootState) =>
        selectLandingOrderForm(state.landingOrderForm)
    );

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
                unitPrice ?? 0,
                additionalDepositAmount,
                ignoreBorrowedAmount
            );
            return orderEstimation ? orderEstimation[0] : ZERO_BI;
        },
        enabled: !!securedFinance && !!account,
    });
};
