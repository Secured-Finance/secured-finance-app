import { FilecoinNumber } from '@glif/filecoin-number';
import { CID } from '@glif/filecoin-wallet-provider';
import { BigNumber as BNEthers, ContractTransaction } from 'ethers';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { transactionFailed, updateTransaction } from 'src/store/transaction';
import { TransactionStatus } from 'src/store/transaction/types';
import { Currency } from 'src/utils/currencyList';
import useSF from './useSecuredFinance';

export const useVerifyPayment = (
    amount: number,
    counterpartyAddress: string,
    currency: Currency,
    timestamp: number
) => {
    const client = useSF();
    const dispatch = useDispatch();

    const verifyFilecoinPayment = useCallback(
        async (transactionHash: CID) => {
            if (!client) {
                return false;
            }
            if (!transactionHash) {
                dispatch(transactionFailed('No transaction to verify'));
                return false;
            }

            const value = new FilecoinNumber(amount, 'fil');
            const timestampBN = BNEthers.from(timestamp);
            const ethTx: ContractTransaction = await client.verifyPayment(
                counterpartyAddress,
                currency.toString(),
                BNEthers.from(value.toAttoFil()),
                timestampBN,
                transactionHash['/']
            );
            dispatch(updateTransaction(ethTx.hash, TransactionStatus.Settled));

            return true;
        },
        [amount, client, counterpartyAddress, currency, dispatch, timestamp]
    );

    return {
        verifyFilecoinPayment,
    };
};
