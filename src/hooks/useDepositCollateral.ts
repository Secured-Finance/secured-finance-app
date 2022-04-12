import { BigNumber, Overrides, utils } from 'ethers';
import { useCallback } from 'react';
import { useWallet } from 'use-wallet';
import { provider } from 'web3-core';
import useSF from './useSecuredFinance';

export const useDepositCollateral = (
    ccy: string,
    amount: number | BigNumber
) => {
    const securedFinance = useSF();
    const { account }: { account: string; ethereum: provider } = useWallet();

    const handleDepositCollateral = useCallback(async () => {
        const etherAmount = utils.parseUnits(amount.toString(), 'ether');
        const tx = await securedFinance.depositCollateral(ccy, etherAmount);
        return tx;
    }, [account, ccy, amount]);

    return { onDepositCollateral: handleDepositCollateral };
};

export const useWithdrawCollateral = (
    ccy: string,
    amount: number | BigNumber
) => {
    const securedFinance = useSF();
    const { account }: { account: string; ethereum: provider } = useWallet();

    const handleWithdrawCollateral = useCallback(async () => {
        try {
            const tx = await securedFinance.withdrawCollateral(ccy, amount);
            return tx;
        } catch (e) {
            return false;
        }
    }, [account, ccy, amount]);

    return { onWithdrawCollateral: handleWithdrawCollateral };
};
