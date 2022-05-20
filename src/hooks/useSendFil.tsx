import { validateAddressString } from '@glif/filecoin-address';
import {
    LotusMessage,
    Message,
    SignedLotusMessage,
} from '@glif/filecoin-message';
import { BigNumber, FilecoinNumber } from '@glif/filecoin-number';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    emptyGasInfo,
    insufficientMsigFundsErr,
    insufficientSendFundsErr,
} from 'src/services/ledger/constants';
import { setMaxTxFee } from 'src/store/sendForm';
import { RootState } from 'src/store/types';
import { getFilWallet } from 'src/store/wallets/selectors';

// TODO: add params
// TODO: use frozen, fetchingTxDetails, mPoolPushing and value Error to disable Send button
// TODO: use uncaughtError, attemptingTx
// TODO: handle message confirmation

const params = '';

const friendlifyError = (err: Error) => {
    if (!err.message) return err;
    if (err.message.toLowerCase().includes('retcode=2'))
        return insufficientMsigFundsErr;
    if (err.message.toLowerCase().includes('retcode=6'))
        return insufficientSendFundsErr;
    return err.message;
};

export const useSendFil = (
    amount = 0,
    toAddress: string,
    close: () => void,
    setOngoingTx: React.Dispatch<React.SetStateAction<boolean>>
) => {
    const [, setFrozen] = useState(false);
    const [gasInfo, setGasInfo] = useState(emptyGasInfo);
    const [, setValueError] = useState('');
    const [, setFetchingTxDetails] = useState(false);
    const [, setMPoolPushing] = useState(false);
    const wallet = useSelector(getFilWallet);
    const value = useMemo(() => new FilecoinNumber(amount, 'fil'), [amount]);

    const dispatch = useDispatch();
    const { walletProvider } = useSelector(
        (state: RootState) => state.filWalletProvider
    );

    const getMaxAffordableFee = useCallback(() => {
        const affordableFee = new BigNumber(wallet.balance).minus(value);
        return new FilecoinNumber(affordableFee, 'fil');
    }, [wallet, value]);

    const estimate = useCallback(async () => {
        const message: LotusMessage = new Message({
            to: toAddress,
            from: wallet.address,
            value: value.toAttoFil(),
            nonce: 0,
            method: 0,
            params,
        }).toLotusType();
        try {
            setFrozen(true);
            const res = await walletProvider.gasEstimateMaxFee(
                message as LotusMessage
            );
            setGasInfo({
                gasPremium: new FilecoinNumber(
                    res.message.GasPremium,
                    'attofil'
                ),
                gasFeeCap: new FilecoinNumber(res.message.GasFeeCap, 'attofil'),
                gasLimit: new FilecoinNumber(res.message.GasLimit, 'attofil'),
                estimatedTransactionFee: res.maxFee,
            });

            dispatch(setMaxTxFee(res.maxFee));
            if (res.maxFee.isGreaterThanOrEqualTo(getMaxAffordableFee())) {
                const err =
                    message.Method === 0
                        ? insufficientSendFundsErr
                        : insufficientMsigFundsErr;
                setValueError(err);
            }
        } catch (err) {
            setValueError(friendlifyError(err as Error).toString());
        } finally {
            setFrozen(false);
        }
    }, [
        dispatch,
        getMaxAffordableFee,
        toAddress,
        value,
        wallet.address,
        walletProvider,
    ]);

    useEffect(() => {
        // estimate gas price and tx fee
        if (toAddress && validateAddressString(toAddress) && amount !== 0) {
            estimate();
        }
    }, [toAddress, amount, estimate]);

    const send = useCallback(async () => {
        setFetchingTxDetails(true);

        const provider = walletProvider;

        if (provider) {
            const nonce = await provider.getNonce(wallet.address);

            const message = new Message({
                to: toAddress,
                from: wallet.address,
                value: value.toAttoFil(),
                method: 0,
                gasFeeCap: gasInfo?.gasFeeCap.toAttoFil(),
                gasLimit: new BigNumber(
                    gasInfo?.gasLimit.toAttoFil()
                ).toNumber(),
                gasPremium: gasInfo?.gasPremium.toAttoFil(),
                nonce,
                params,
            }).toLotusType();

            setFetchingTxDetails(false);
            const signedMessage: SignedLotusMessage =
                await provider.wallet.sign(wallet.address, message);

            setMPoolPushing(true);
            const validMsg = await provider.simulateMessage(message);
            if (validMsg) {
                const msgCid = await provider.sendMessage(
                    message,
                    signedMessage.Signature.Data
                );

                return msgCid;
            }
            throw new Error(
                'Filecoin message invalid. No gas or fees were spent.'
            );
        }
    }, [
        gasInfo?.gasFeeCap,
        gasInfo?.gasLimit,
        gasInfo?.gasPremium,
        toAddress,
        value,
        wallet.address,
        walletProvider,
    ]);

    const sendFil = useCallback(async () => {
        try {
            const message = await send();
            if (message) {
                close();
            }
        } catch (err) {
            const e = err as Error;
            if (e.message.includes('Unexpected number of items')) {
                console.error(
                    'Ledger devices cannot sign arbitrary base64 params yet. Coming soon.'
                );
            } else {
                console.error(e.message);
            }
        } finally {
            setOngoingTx(false);
            setFetchingTxDetails(false);
            setMPoolPushing(false);
        }
    }, [close, send, setOngoingTx]);

    return { sendFil };
};
