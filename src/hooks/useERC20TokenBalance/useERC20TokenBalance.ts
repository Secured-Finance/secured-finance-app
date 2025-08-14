import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import { QueryKeys } from 'src/hooks/queries';
import useSF from 'src/hooks/useSecuredFinance';
import { RootState } from 'src/store/types';
import { ZERO_BI } from 'src/utils';

export const useERC20TokenBalance = (tokenAddress = '') => {
    const securedFinance = useSF();
    const { address } = useSelector((state: RootState) => state.wallet);

    return useQuery({
        queryKey: [QueryKeys.ERC20_TOKEN_BALANCE, tokenAddress, address],
        queryFn: async () => {
            const balance = await securedFinance?.getERC20TokenBalance(
                tokenAddress,
                address,
            );

            return balance ?? ZERO_BI;
        },
        enabled: !!securedFinance && !!tokenAddress && !!address,
    });
};
