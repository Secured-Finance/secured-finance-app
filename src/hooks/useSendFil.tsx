import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useEffect, useState } from 'react';
import { RootState } from 'src/store/types';
import { getFilWallet } from 'src/store/wallets/selectors';
import {
    LotusMessage,
    Message,
    SignedLotusMessage,
} from '@glif/filecoin-message';
import { BigNumber, FilecoinNumber } from '@glif/filecoin-number';
import {
    emptyGasInfo,
    insufficientMsigFundsErr,
    insufficientSendFundsErr,
    SEND,
    TESTNET_PATH_CODE,
} from 'src/services/ledger/constants';
import createPath from 'src/services/ledger/createPath';
import { validateAddressString } from '@glif/filecoin-address';
import { setMaxTxFee, updateSendAmount } from 'src/store/sendForm';

// TODO: add params
// TODO: use frozen, fetchingTxDetails, mPoolPushing and value Error to disable Send button
// TODO: use uncaughtError, attemptingTx
// TODO: handle message confirmation

const params = '';

// @ts-ignore
const friendlifyError = err => {
    if (!err.message) return err;
    if (err.message.toLowerCase().includes('retcode=2'))
        return insufficientMsigFundsErr;
    if (err.message.toLowerCase().includes('retcode=6'))
        return insufficientSendFundsErr;
    return err.message;
};

const path = createPath(TESTNET_PATH_CODE, 0);

export const useSendFil = (
    amount = 0,
    toAddress: string,
    close: any,
    setOngoingTx: any
) => {
    const [frozen, setFrozen] = useState(false);
    const [gasInfo, setGasInfo] = useState(emptyGasInfo);
    const [valueError, setValueError] = useState('');
    const [fetchingTxDetails, setFetchingTxDetails] = useState(false);
    const [mPoolPushing, setMPoolPushing] = useState(false);
    const [uncaughtError, setUncaughtError] = useState('');
    const wallet = useSelector(getFilWallet);
    const value = new FilecoinNumber(amount, 'fil');

    const dispatch = useDispatch();
    const { walletProvider } = useSelector(
        (state: RootState) => state.filWalletProvider
    );

    const getMaxAffordableFee = () => {
        const affordableFee = wallet.balance.minus(value);
        return new FilecoinNumber(affordableFee, 'fil');
    };

    const estimate = async () => {
        const message: LotusMessage = new Message({
            to: toAddress,
            from: wallet.address,
            value: value.toAttoFil(),
            nonce: 0,
            method: 0,
            params,
            gasFeeCap: gasInfo?.gasFeeCap.toAttoFil(),
            gasLimit: new BigNumber(gasInfo?.gasLimit.toAttoFil()).toNumber(),
            gasPremium: gasInfo?.gasPremium.toAttoFil(),
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
            setValueError(friendlifyError(err));
        } finally {
            setFrozen(false);
        }
    };

    useEffect(() => {
        // estimate gas price and tx fee
        if (toAddress && validateAddressString(toAddress) && amount !== 0) {
            estimate();
        }
    }, [toAddress, amount]);

    const send = async () => {
        setFetchingTxDetails(true);

        let provider = walletProvider;

        if (provider) {
            const nonce = await provider.getNonce(wallet.address);
            const message: Message = new Message({
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
            });

            setFetchingTxDetails(false);
            const signedMessage: SignedLotusMessage =
                // @ts-ignore
                await provider.wallet.sign(message.toSerializeableType(), path);

            const messageObj: any = message.toLotusType();
            setMPoolPushing(true);
            const validMsg = await provider.simulateMessage(
                message.toLotusType()
            );
            if (validMsg) {
                const msgCid = await provider.sendMessage(
                    message.toLotusType(),
                    // @ts-ignore
                    signedMessage
                );

                messageObj.cid = msgCid['/'];
                messageObj.timestamp = new Date();
                messageObj.maxFee = gasInfo.estimatedTransactionFee.toAttoFil();
                // dont know how much was actually paid in this message yet, so we mark it as 0
                messageObj.paidFee = '0';
                messageObj.value = new FilecoinNumber(
                    messageObj.Value,
                    'attofil'
                ).toAttoFil();
                messageObj.method = SEND;
                messageObj.params = params || {};
                return messageObj;
            }
            throw new Error(
                'Filecoin message invalid. No gas or fees were spent.'
            );
        }
    };

    const sendFil = useCallback(async () => {
        try {
            const message = await send();
            if (message) {
                updateSendAmount(0);
                close();
            }
        } catch (err) {
            if (err.message.includes('Unexpected number of items')) {
                setUncaughtError(
                    'Ledger devices cannot sign arbitrary base64 params yet. Coming soon.'
                );
            } else {
                setUncaughtError(err.message);
            }
        } finally {
            setOngoingTx(false);
            setFetchingTxDetails(false);
            setMPoolPushing(false);
        }
    }, [amount, toAddress]);

    return { sendFil };
};
