import { useQuery } from '@tanstack/react-query';
import { QueryKeys } from 'src/hooks';
import useSF from 'src/hooks/useSecuredFinance';

export const useIsRedemptionRequired = (account: string | undefined) => {
    const securedFinance = useSF();

    return useQuery({
        queryKey: [QueryKeys.TERMINATION_REDEMPTION_REQUIRED, account],
        queryFn: async () => {
            return securedFinance?.isRedemptionRequired(account ?? '') ?? false;
        },
        placeholderData: false,
        enabled: !!securedFinance && !!account,
    });
};
