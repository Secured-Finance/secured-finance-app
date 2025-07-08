import { OrderSide, WalletSource } from '@secured-finance/sf-client';
import { useQuery } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { QueryKeys } from 'src/hooks/queries';
import useSF from 'src/hooks/useSecuredFinance';
import { selectLandingOrderForm } from 'src/store/landingOrderForm';
import { RootState } from 'src/store/types';
import { ZERO_BI, toCurrency } from 'src/utils';

export const useOrderEstimation = (
    account: string | undefined,
    skip = false
) => {
    const securedFinance = useSF();
    const [isMinLoading, setIsMinLoading] = useState(false);

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

    const query = useQuery({
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
            setIsMinLoading(true);

            try {
                const [orderEstimation] = await Promise.all([
                    securedFinance?.getOrderEstimation(
                        toCurrency(currency),
                        maturity,
                        account ?? '',
                        side,
                        amount,
                        (unitPrice ?? 0) * 100.0,
                        additionalDepositAmount,
                        ignoreBorrowedAmount
                    ),
                    new Promise(resolve => setTimeout(resolve, 500)), // Minimum 500ms
                ]);
                return orderEstimation;
            } finally {
                setIsMinLoading(false);
            }
        },
        enabled: !!securedFinance && !!account && !skip,
    });

    return {
        ...query,
        isLoading: query.isLoading || isMinLoading,
    };
};
