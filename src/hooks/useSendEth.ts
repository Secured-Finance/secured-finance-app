import { TransactionRequest } from '@ethersproject/abstract-provider';
import { BigNumber, FixedNumber, utils } from 'ethers';
import { useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { formatUsdAmount } from 'src/utils';
import { useWallet } from 'use-wallet';
import { updateSendTxFee } from '../store/sendForm';
import { RootState } from '../store/types';
import useSF from './useSecuredFinance';

export const useSendEth = (
    amount: number | BigNumber,
    to: string,
    gasPrice: number | BigNumber
) => {
    const { account } = useWallet();
    const securedFinance = useSF();

    const handleSendEther = useCallback(async () => {
        if (account && securedFinance) {
            const gweiGasPrice = utils.parseUnits(gasPrice.toString(), 'gwei');
            try {
                const tx = securedFinance.sendEther(
                    utils.parseEther(amount.toString()),
                    to,
                    gweiGasPrice
                );
                return (await tx).hash;
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
        const gweiGasPrice = utils.parseUnits(gasPrice.toString(), 'gwei');

        const transactionObject: TransactionRequest = {
            from: account,
            to: '0x0000000000000000000000000000000000000000',
            value: 0,
            gasPrice: gweiGasPrice,
        };
        const gasLimit = await securedFinance.signerOrProvider.estimateGas(
            transactionObject
        );
        const txFee = gasLimit.mul(gweiGasPrice);
        let usdFeeInWei: BigNumber;
        if (Number.isInteger(ethPrice)) {
            usdFeeInWei = txFee.mul(ethPrice);
        } else {
            const ethPriceBN = BigNumber.from(formatUsdAmount(ethPrice));
            usdFeeInWei = txFee.mul(ethPriceBN).div(10 ** 2);
        }

        const usdFee = FixedNumber.from(utils.formatEther(usdFeeInWei));
        dispatch(updateSendTxFee(usdFee));
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
