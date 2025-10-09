import { toBytes32 } from '@secured-finance/sf-graph-client';
import { DefaultError, useQuery, UseQueryResult } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useLendingMarketControllerRead } from 'src/generated/wagmi';
import { QueryKeys } from 'src/hooks/queries';
import useSF from 'src/hooks/useSecuredFinance';
import {
    CurrencyConverter,
    CurrencySymbol,
    FeeCalculator,
    useHookSwitcher,
    ZERO_BI,
} from 'src/utils';

// Legacy implementation using secured finance SDK
const useOrderFeeLegacy = (ccy: CurrencySymbol) => {
    const securedFinance = useSF();

    return useQuery({
        queryKey: [QueryKeys.ORDER_FEE, ccy],
        queryFn: async () => {
            const orderFee = securedFinance?.getOrderFeeRate(
                CurrencyConverter.symbolToContract(ccy)
            );
            return orderFee ?? ZERO_BI;
        },
        select: fee => FeeCalculator.calculateProtocolFee(fee),
        enabled: !!securedFinance,
    });
};

// New wagmi implementation using generated hooks
const useOrderFeeWagmi = (ccy: CurrencySymbol) => {
    const {
        data: rawFeeRate,
        isLoading,
        error,
    } = useLendingMarketControllerRead({
        functionName: 'getOrderFeeRate',
        args: [toBytes32(ccy)],
    });

    const calculatedFee = useMemo(() => {
        if (!rawFeeRate) return undefined;
        return FeeCalculator.calculateProtocolFee(rawFeeRate);
    }, [rawFeeRate]);

    return {
        data: calculatedFee,
        isPending: isLoading,
        error,
    } as UseQueryResult<number, DefaultError>;
};

// Main hook with feature flag switching
export const useOrderFee = (ccy: CurrencySymbol) => {
    const legacyResult = useOrderFeeLegacy(ccy);
    const wagmiResult = useOrderFeeWagmi(ccy);

    return useHookSwitcher(
        () => legacyResult,
        () => wagmiResult
    );
};
