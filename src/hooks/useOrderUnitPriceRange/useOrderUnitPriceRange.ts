import { useQuery } from '@tanstack/react-query';
import { QueryKeys } from 'src/hooks/queries';
import useSF from 'src/hooks/useSecuredFinance';
import { CurrencySymbol, toCurrency } from 'src/utils';

export type OrderUnitPriceRange = {
    minLendUnitPrice: number;
    maxLendUnitPrice: number;
    minBorrowUnitPrice: number;
    maxBorrowUnitPrice: number;
    referenceUnitPrice: number;
    isMinDebtUnitPriceReference: boolean;
};

export const useOrderUnitPriceRange = (
    ccy: CurrencySymbol,
    maturity: number
) => {
    const securedFinance = useSF();

    return useQuery({
        queryKey: [
            QueryKeys.ORDER_UNIT_PRICE_RANGE,
            ccy,
            maturity,
            securedFinance?.config.chain.id,
        ],
        queryFn: async (): Promise<OrderUnitPriceRange> => {
            const range = await securedFinance?.getOrderUnitPriceRange(
                toCurrency(ccy),
                maturity
            );
            if (!range)
                throw new Error('Order unit price range is unavailable');

            const [
                minLendUnitPrice,
                maxLendUnitPrice,
                minBorrowUnitPrice,
                maxBorrowUnitPrice,
                referenceUnitPrice,
                isMinDebtUnitPriceReference,
            ] = range;

            return {
                minLendUnitPrice: Number(minLendUnitPrice),
                maxLendUnitPrice: Number(maxLendUnitPrice),
                minBorrowUnitPrice: Number(minBorrowUnitPrice),
                maxBorrowUnitPrice: Number(maxBorrowUnitPrice),
                referenceUnitPrice: Number(referenceUnitPrice),
                isMinDebtUnitPriceReference,
            };
        },
        enabled: !!securedFinance && maturity > 0,
    });
};
