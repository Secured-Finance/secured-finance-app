import { SecuredFinanceClient } from '@secured-finance/sf-client';
import { Token } from '@secured-finance/sf-core';
import { useCallback } from 'react';

export const useERC20Balance = (
    securedFinance: SecuredFinanceClient | undefined
) => {
    const getERC20Balance = useCallback(
        async (account: string | null, token: Token) => {
            try {
                if (!securedFinance || !account) return;
                const balance = await securedFinance.getERC20Balance(
                    token,
                    account
                );
                return balance;
            } catch (error) {
                console.error(error);
            }
        },
        [securedFinance]
    );

    return { getERC20Balance };
};
