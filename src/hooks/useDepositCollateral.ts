import { BigNumber } from 'ethers';
import { useCallback } from 'react';
import { CurrencySymbol, toCurrency } from 'src/utils';
import useSF from './useSecuredFinance';

export const useDepositCollateral = (
    ccy: CurrencySymbol,
    amount: number | BigNumber
) => {
    const securedFinance = useSF();

    const handleDepositCollateral = useCallback(async () => {
        if (!securedFinance) {
            return;
        }
        const tx = await securedFinance.depositCollateral(
            toCurrency(ccy),
            amount
        );
        return tx;
    }, [amount, securedFinance, ccy]);

    return { onDepositCollateral: handleDepositCollateral };
};

export const useWithdrawCollateral = (
    ccy: CurrencySymbol,
    amount: number | BigNumber
) => {
    const securedFinance = useSF();

    const handleWithdrawCollateral = useCallback(async () => {
        if (!securedFinance) {
            return;
        }
        const tx = await securedFinance.withdrawCollateral(
            toCurrency(ccy),
            amount
        );
        return tx;
    }, [securedFinance, ccy, amount]);

    return { onWithdrawCollateral: handleWithdrawCollateral };
};
