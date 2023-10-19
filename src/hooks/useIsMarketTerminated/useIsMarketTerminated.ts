import { useQuery } from '@tanstack/react-query';
import { QueryKeys } from 'src/hooks/queries';
import useSF from 'src/hooks/useSecuredFinance';
import { CurrencySymbol, hexToCurrencySymbol, toCurrency } from 'src/utils';

export const useIsMarketTerminated = () => {
    const securedFinance = useSF();

    return useQuery({
        queryKey: [QueryKeys.TERMINATED],
        queryFn: async () => {
            return securedFinance?.isTerminated() ?? false;
        },
        placeholderData: false,
        enabled: !!securedFinance,
        staleTime: Infinity,
        refetchOnWindowFocus: true,
    });
};

export const useMarketTerminationDate = () => {
    const securedFinance = useSF();

    return useQuery({
        queryKey: [QueryKeys.TERMINATION_DATE],
        queryFn: async () => {
            return (
                (
                    await securedFinance?.getMarketTerminationDate()
                )?.toNumber() ?? undefined
            );
        },
        placeholderData: undefined,
        enabled: !!securedFinance,
        staleTime: Infinity,
        refetchOnWindowFocus: true,
    });
};

export const useMarketTerminationRatio = () => {
    const securedFinance = useSF();

    return useQuery({
        queryKey: [QueryKeys.TERMINATION_RATIO],
        queryFn: async () => {
            const currencies =
                (await securedFinance?.getCollateralCurrencies()) ?? [];
            return Promise.all(
                currencies.map(async currency => {
                    const ccy = hexToCurrencySymbol(currency);
                    if (ccy) {
                        return {
                            currency: ccy,
                            ratio:
                                ((
                                    await securedFinance?.getMarketTerminationRatio(
                                        toCurrency(ccy)
                                    )
                                )?.toNumber() ?? 0) / 1e7,
                            price:
                                ((
                                    await securedFinance?.getMarketTerminationPrice(
                                        toCurrency(ccy)
                                    )
                                )?.toNumber() ?? 0) / 1e8,
                        };
                    }
                })
            );
        },
        enabled: !!securedFinance,
        placeholderData: [],
        select: data =>
            data.filter(
                (
                    d
                ): d is NonNullable<{
                    currency: CurrencySymbol;
                    ratio: number;
                    price: number;
                }> => d !== undefined
            ),
        staleTime: Infinity,
        refetchOnWindowFocus: true,
    });
};

export const useIsRedemptionRequired = (account: string | undefined) => {
    const securedFinance = useSF();

    return useQuery({
        queryKey: [QueryKeys.TERMINATION_REDEMPTION_REQUIRED, account],
        queryFn: async () => {
            return securedFinance?.isRedemptionRequired(account ?? '') ?? false;
        },
        placeholderData: false,
        enabled: !!securedFinance && !!account,
        staleTime: Infinity,
        refetchOnWindowFocus: true,
    });
};
