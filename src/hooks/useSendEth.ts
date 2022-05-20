import BigNumber from 'bignumber.js';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useWallet } from 'use-wallet';
import { updateSendTxFee } from '../store/sendForm';
import { RootState } from '../store/types';
import useSF from './useSecuredFinance';

export const useSendEth = (amount: number, to: string, gasPrice: number) => {
    const { account } = useWallet();
    const securedFinance = useSF();

    const handleSendEther = useCallback(async () => {
        if (account && securedFinance) {
            const gweiGasPrice = new BigNumber(gasPrice)
                .multipliedBy(new BigNumber(10).pow(9))
                .toNumber();
            try {
                // this does not work today and will break as soon as we upgrade to the new SDK
                // TODO: FIX THIS
                const tx = securedFinance.ethersUtils
                    .sendTransaction({
                        from: account,
                        to: to,
                        value: new BigNumber(amount).multipliedBy(
                            new BigNumber(10).pow(18)
                        ),
                        gasPrice: gweiGasPrice,
                    })
                    .on(
                        'transactionHash',
                        (tx: { transactionHash: string }) => {
                            return tx.transactionHash;
                        }
                    );
                return tx;
            } catch (e) {
                return false;
            }
        }
    }, [account, securedFinance, amount, to, gasPrice]);

    return { onSendEth: handleSendEther };
};

export const useEstimateTxFee = (gasPrice: number) => {
    const { account } = useWallet();
    const securedFinance = useSF();
    const ethPrice = useSelector(
        (state: RootState) => state.assetPrices.ethereum.price
    );
    const txFee = useSelector((state: RootState) => state.sendForm.txFee);
    const dispatch = useDispatch();

    const handleEstimateTxFee = useCallback(async () => {
        const gweiGasPrice = new BigNumber(gasPrice)
            .multipliedBy(new BigNumber(10).pow(9))
            .toNumber();
        const transactionObject = {
            from: account,
            to: '0x0000000000000000000000000000000000000000',
            value: 0,
            gasPrice: gweiGasPrice,
        };
        // this does not work today and will break as soon as we upgrade to the new SDK
        // TODO: FIX THIS
        securedFinance.utils
            .estimateGas(transactionObject)
            .then((gasLimit: number) => {
                const transactionFee = gasPrice * gasLimit;
                const txFee = new BigNumber(transactionFee)
                    .dividedBy(new BigNumber(10).pow(9))
                    .multipliedBy(ethPrice)
                    .toNumber();
                dispatch(updateSendTxFee(txFee));
            });
    }, [account, securedFinance, gasPrice, dispatch, ethPrice]);

    useEffect(() => {
        if (account && securedFinance) {
            handleEstimateTxFee();
        }
    }, [
        account,
        securedFinance,
        gasPrice,
        dispatch,
        ethPrice,
        handleEstimateTxFee,
    ]);

    return txFee;
};
