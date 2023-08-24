import { OrderSide, WalletSource } from '@secured-finance/sf-client';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectLandingOrderForm } from 'src/store/landingOrderForm';
import { RootState } from 'src/store/types';
import { toCurrency } from 'src/utils';
import { QueryKeys } from '../queries';
import useSF from '../useSecuredFinance';

export const useOrderEstimation = (account: string) => {
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
        () => (side === OrderSide.BORROW ? isBorrowedCollateral : undefined),
        [isBorrowedCollateral, side]
    );

    const additionalDepositAmount = useMemo(
        () =>
            side === OrderSide.LEND && sourceAccount === WalletSource.METAMASK
                ? amount
                : undefined,
        [amount, side, sourceAccount]
    );

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
                account,
                side,
                amount,
                unitPrice ?? 0,
                additionalDepositAmount ?? 0,
                ignoreBorrowedAmount
            );
            return orderEstimation?.coverage.toNumber();
        },
        enabled: !!securedFinance,
    });
};
