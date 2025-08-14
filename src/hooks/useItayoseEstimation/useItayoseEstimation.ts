import { useQuery } from '@tanstack/react-query';
import { QueryKeys } from 'src/hooks/queries';
import useSF from 'src/hooks/useSecuredFinance';
import { CurrencySymbol, ZERO_BI, toCurrency } from 'src/utils';

export interface ItayoseEstimation {
    openingUnitPrice: bigint;
    lastLendUnitPrice: bigint;
    lastBorrowUnitPrice: bigint;
    totalOffsetAmount: bigint;
}

export const emptyOrderEstimation: ItayoseEstimation = {
    openingUnitPrice: ZERO_BI,
    lastLendUnitPrice: ZERO_BI,
    lastBorrowUnitPrice: ZERO_BI,
    totalOffsetAmount: ZERO_BI,
};

export const useItayoseEstimation = (ccy: CurrencySymbol, maturity: number) => {
    const securedFinance = useSF();

    return useQuery({
        queryKey: [QueryKeys.ITAYOSE_ESTIMATION, ccy, maturity],
        queryFn: async () => {
            const itayoseEstimation =
                await securedFinance?.getItayoseEstimation(
                    toCurrency(ccy),
                    maturity
                );
            return itayoseEstimation ?? emptyOrderEstimation;
        },
        enabled: !!securedFinance && !!ccy && !!maturity,
    });
};
