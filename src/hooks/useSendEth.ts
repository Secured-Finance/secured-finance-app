import BigNumber from 'bignumber.js';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useWallet } from 'use-wallet';
import { updateSendTxFee } from '../store/sendForm';
import { RootState } from '../store/types';
import useSF from './useSecuredFinance';

export const useSendEth = (amount: number, to: string, gasPrice: number) => {
    const { account } = useWallet();
    const securedFinance = useSF() as any;

    const handleSendEther = useCallback(async () => {
        if (account && securedFinance) {
            const gweiGasPrice = new BigNumber(gasPrice)
                .multipliedBy(new BigNumber(10).pow(9))
                .toNumber();
            try {
                const tx = securedFinance.web3.eth
                    .sendTransaction({
                        from: account,
                        to: to,
                        value: new BigNumber(amount).multipliedBy(
                            new BigNumber(10).pow(18)
                        ),
                        gasPrice: gweiGasPrice,
                    })
                    .on('transactionHash', (tx: any) => {
                        return tx.transactionHash;
                    });
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
    const securedFinance: any = useSF();
    const ethPrice = useSelector(
        (state: RootState) => state.assetPrices.ethereum.price
    );
    const txFee = useSelector((state: RootState) => state.sendForm.txFee);
    const dispatch = useDispatch();

    const handleEstimateTxFee = useCallback(
        async (isMounted: boolean) => {
            const gweiGasPrice = new BigNumber(gasPrice)
                .multipliedBy(new BigNumber(10).pow(9))
                .toNumber();
            const transactionObject = {
                from: account,
                to: '0x0000000000000000000000000000000000000000',
                value: 0,
                gasPrice: gweiGasPrice,
            };
            securedFinance.web3.eth
                .estimateGas(transactionObject)
                .then((gasLimit: number) => {
                    const transactionFee = gasPrice * gasLimit;
                    const txFee = new BigNumber(transactionFee)
                        .dividedBy(new BigNumber(10).pow(9))
                        .multipliedBy(ethPrice)
                        .toNumber();
                    dispatch(updateSendTxFee(txFee));
                });
        },
        [account, securedFinance, gasPrice, dispatch, ethPrice]
    );

    useEffect(() => {
        let isMounted = true;
        if (account && securedFinance) {
            handleEstimateTxFee(isMounted);
        }
        return () => {
            isMounted = false;
        };
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
