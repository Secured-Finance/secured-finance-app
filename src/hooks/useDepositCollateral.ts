import { BigNumber, utils } from 'ethers';
import { useCallback } from 'react';
import useSF from './useSecuredFinance';

export const useDepositCollateral = (
    ccy: string,
    amount: number | BigNumber
) => {
    const securedFinance = useSF();

    const handleDepositCollateral = useCallback(async () => {
        const etherAmount = utils.parseUnits(amount.toString(), 'ether');
        const tx = await securedFinance.depositCollateral(ccy, etherAmount);
        return tx;
    }, [amount, securedFinance, ccy]);

    return { onDepositCollateral: handleDepositCollateral };
};

export const useWithdrawCollateral = (
    ccy: string,
    amount: number | BigNumber
) => {
    const securedFinance = useSF();

    const handleWithdrawCollateral = useCallback(async () => {
        try {
            const tx = await securedFinance.withdrawCollateral(ccy, amount);
            return tx;
        } catch (e) {
            return false;
        }
    }, [securedFinance, ccy, amount]);

    return { onWithdrawCollateral: handleWithdrawCollateral };
};
