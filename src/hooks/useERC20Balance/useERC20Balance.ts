import { SecuredFinanceClient } from '@secured-finance/sf-client';
import { Token } from '@secured-finance/sf-core';
import { BigNumber } from 'ethers';
import { useCallback } from 'react';

export const useERC20Balance = (
    securedFinance: SecuredFinanceClient | undefined
) => {
    const getERC20Balance = useCallback(
        async (account: string | null, token: Token) => {
            let balance = BigNumber.from(0);
            try {
                if (!securedFinance || !account) return balance;
                balance = await securedFinance.getERC20Balance(token, account);
            } catch (error) {
                console.error(error);
            }
            return balance;
        },
        [securedFinance]
    );

    return { getERC20Balance };
};
