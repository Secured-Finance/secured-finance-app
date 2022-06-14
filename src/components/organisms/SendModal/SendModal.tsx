import { validateAddressString } from '@glif/filecoin-address';
import BigNumber from 'bignumber.js';
import React, { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import {
    Button,
    Modal,
    ModalActions,
    ModalContent,
    ModalProps,
    ModalTitle,
    Spacer,
} from 'src/components/atoms';
import { CurrencyImage } from 'src/components/common/CurrencyImage';
import { useSendEth } from 'src/hooks/useSendEth';
import { useSendFil } from 'src/hooks/useSendFil';
import { useVerifyPayment } from 'src/hooks/useVerifyPayment';
import { getAssetInfo } from 'src/store/assetPrices/selectors';
import { RootState } from 'src/store/types';
import { getBalance } from 'src/store/wallets/selectors';
import theme from 'src/theme';
import { formatInput } from 'src/utils';
import { Currency, CurrencyInfo } from 'src/utils/currencyList';
import styled from 'styled-components';
import { isAddress } from 'web3-utils';
import { FilTxFeeTable } from './components/FilTxFeeTable';
import { GasTabsAndTable } from './components/GastabsAndTable';
import SettlementValidation from './components/SettlementValidation';

const SendModal = ({
    onDismiss,
    amount,
    currencyInfo,
    toAddress,
    counterpartyAddress,
    nextCouponPaymentDate,
    settleTransaction = false,
}: {
    amount?: number;
    currencyInfo: CurrencyInfo;
    toAddress?: string;
    counterpartyAddress?: string;
    nextCouponPaymentDate?: number;
    settleTransaction?: boolean;
} & ModalProps) => {
    const [addrErr, setAddrErr] = useState(false);
    const [balanceErr, setBalanceErr] = useState(false);
    const [ongoingTx, setOngoingTx] = useState(false);
    const [recipientAddress, setRecipientAddress] = useState(toAddress ?? '');
    const [amountToSend, setAmountToSend] = useState(amount ?? 0);

    const balance = useSelector((state: RootState) =>
        getBalance(
            state,
            currencyInfo.fullName.toLowerCase() as 'ethereum' | 'filecoin'
        )
    );

    const { price } = useSelector(getAssetInfo(currencyInfo.shortName));
    const { hash, status, error } = useSelector(
        (state: RootState) => state.transaction
    );

    const TotalUsdAmount = useMemo(
        () => (amountToSend * price).toFixed(2),
        [amountToSend, price]
    );

    const { maxTxFee, gasPrice } = useSelector(
        (state: RootState) => state.sendForm
    );

    const maxFilTxFee = Number(maxTxFee.toFil());

    const handleRecipientAddress = (e: React.FormEvent<HTMLInputElement>) => {
        setAddrErr(false);
        setRecipientAddress(e.currentTarget.value);
    };

    const renderBalance = ({
        balance,
        currency,
    }: {
        balance: number;
        currency: Currency;
    }) => {
        return (
            <span>
                {balance.toFixed(2)} {currency}
            </span>
        );
    };

    const isValidAddress = useCallback(() => {
        switch (currencyInfo.indexCcy) {
            case 0:
                return isAddress(recipientAddress);
            case 1:
                return validateAddressString(recipientAddress);
        }
    }, [currencyInfo.indexCcy, recipientAddress]);

    const isEnoughBalance = useCallback(
        (amount: string) => {
            switch (currencyInfo.indexCcy) {
                case 0:
                    return new BigNumber(amount).isLessThanOrEqualTo(
                        new BigNumber(balance)
                    );
                case 1:
                    return +amount + maxFilTxFee <= balance;
            }
        },
        [balance, currencyInfo.indexCcy, maxFilTxFee]
    );

    const handleSendAmount = (e: React.FormEvent<HTMLInputElement>) => {
        setAmountToSend(+e.currentTarget.value);
        if (!isEnoughBalance(e.currentTarget.value)) {
            setBalanceErr(true);
        } else {
            setBalanceErr(false);
        }
    };

    const { onSendEth } = useSendEth(amountToSend, recipientAddress, gasPrice);
    const { sendFil, validateFilecoinTransaction } = useSendFil(
        amountToSend,
        recipientAddress
    );

    const { verifyFilecoinPayment } = useVerifyPayment(
        amountToSend,
        counterpartyAddress,
        currencyInfo.shortName,
        nextCouponPaymentDate
    );

    const handleTransferAssets = useCallback(async () => {
        try {
            if (!recipientAddress || amountToSend <= 0) {
                return;
            }

            if (!isValidAddress()) {
                setAddrErr(true);
                return;
            }

            setOngoingTx(true);

            if (currencyInfo.shortName === Currency.FIL) {
                const tx = await sendFil();
                if (
                    tx &&
                    (await validateFilecoinTransaction(tx)) &&
                    settleTransaction &&
                    (await verifyFilecoinPayment(tx))
                ) {
                    setOngoingTx(false);
                }
            } else {
                await onSendEth();
            }
            setOngoingTx(false);
        } catch (error) {
            console.error(error);
        }
    }, [
        recipientAddress,
        amountToSend,
        isValidAddress,
        currencyInfo.shortName,
        sendFil,
        validateFilecoinTransaction,
        settleTransaction,
        verifyFilecoinPayment,
        onSendEth,
    ]);

    const isSendButtonDisabled = () => {
        return ongoingTx || amountToSend <= 0 || balanceErr;
    };

    const getSendButtonText = () => {
        if (ongoingTx) return 'Confirm transaction';
        if (balanceErr) return 'Insufficient amount';
        return 'Send';
    };

    const onCloseSendModal = () => {
        onDismiss();
    };

    return (
        <Modal>
            <ModalTitle text='Send' />
            <ModalContent paddingBottom={'0'} paddingTop={'0'}>
                <StyledSubcontainer data-cy='send-modal'>
                    <StyledLabelContainer>
                        <StyledLabel textTransform={'capitalize'}>
                            Currency
                        </StyledLabel>
                        <StyledLabel
                            data-cy='balance-label'
                            fontWeight={400}
                            textTransform={'capitalize'}
                        >
                            Balance:
                            {renderBalance({
                                balance,
                                currency: currencyInfo.shortName,
                            })}
                        </StyledLabel>
                    </StyledLabelContainer>
                    <StyledInputContainer>
                        <StyledLabelContainer>
                            <StyledLabel
                                marginBottom={4}
                                color={theme.colors.white}
                                textTransform={'capitalize'}
                                fontSize={16}
                            >
                                {currencyInfo.fullName}
                            </StyledLabel>
                            <StyledLabel
                                fontWeight={400}
                                marginBottom={4}
                                textTransform={'capitalize'}
                                fontSize={16}
                            >
                                ~ ${TotalUsdAmount}
                            </StyledLabel>
                        </StyledLabelContainer>
                        <StyledCurrencyInput>
                            <CurrencyImage
                                selectedCcy={currencyInfo.shortName}
                                showName
                            />
                            <StyledInput
                                data-cy='send-amount-input'
                                type={'number'}
                                placeholder={'0'}
                                value={amountToSend}
                                minLength={1}
                                maxLength={79}
                                onKeyDown={formatInput}
                                onInput={handleSendAmount}
                                disabled={ongoingTx}
                            />
                        </StyledCurrencyInput>
                    </StyledInputContainer>
                </StyledSubcontainer>
                <StyledSubcontainer>
                    <StyledLabelContainer>
                        <StyledLabel textTransform={'capitalize'}>
                            Recipient address
                        </StyledLabel>
                    </StyledLabelContainer>
                    <StyledInputContainer
                        color={
                            addrErr ? theme.colors.red : theme.colors.darkenedBg
                        }
                    >
                        <StyledAddressInput
                            data-cy='send-address-input'
                            type={'text'}
                            placeholder={
                                'Paste ' + currencyInfo.fullName + ' address'
                            }
                            value={recipientAddress}
                            onChange={handleRecipientAddress}
                            disabled={ongoingTx}
                        />
                    </StyledInputContainer>
                </StyledSubcontainer>
                {currencyInfo.indexCcy === 0 && <GasTabsAndTable />}
                {currencyInfo.indexCcy === 1 && <FilTxFeeTable />}
                <SettlementValidation
                    status={status}
                    transactionHash={hash}
                    error={error}
                />
            </ModalContent>
            <ModalActions>
                <StyledButtonContainer>
                    <Button
                        onClick={onCloseSendModal}
                        style={{
                            background: 'transparent',
                            borderWidth: 1,
                            borderColor: theme.colors.buttonBlue,
                            borderBottom: theme.colors.buttonBlue,
                            fontSize: theme.sizes.callout,
                            fontWeight: 500,
                            color: theme.colors.white,
                        }}
                        disabled={ongoingTx}
                    >
                        Cancel
                    </Button>
                    <Spacer size={'md'} />
                    <Button
                        onClick={handleTransferAssets}
                        style={{
                            background: theme.colors.buttonBlue,
                            fontSize: theme.sizes.callout,
                            fontWeight: 500,
                            color: theme.colors.white,
                        }}
                        disabled={isSendButtonDisabled()}
                    >
                        {getSendButtonText()}
                    </Button>
                </StyledButtonContainer>
            </ModalActions>
        </Modal>
    );
};

interface StyledSubcontainerProps {
    marginBottom?: string;
}

const StyledSubcontainer = styled.div<StyledSubcontainerProps>`
    margin-bottom: ${props =>
        props.marginBottom ? props.marginBottom : props.theme.spacing[4]}px;
`;

interface StyledLabelProps {
    textTransform?: string;
    fontWeight?: number;
    fontSize?: number;
    marginBottom?: number;
}

const StyledLabelContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const StyledLabel = styled.div<StyledLabelProps>`
    text-transform: ${props =>
        props.textTransform ? props.textTransform : 'uppercase'};
    font-size: ${props =>
        props.fontSize ? props.fontSize : props.theme.sizes.subhead}px;
    margin-bottom: ${props => (props.marginBottom ? props.marginBottom : 5)}px;
    margin-top: 0px;
    font-weight: ${props => (props.fontWeight ? props.fontWeight : 500)};
    color: ${props => (props.color ? props.color : props.theme.colors.gray)};
`;

interface StyledInputContainerProps {
    color?: string;
}

const StyledInputContainer = styled.div<StyledInputContainerProps>`
    display: flex;
    flex-direction: column;
    padding: 12px 18px;
    border: 1px solid
        ${props => (props.color ? props.color : props.theme.colors.darkenedBg)};
    border-radius: 10px;
`;

const StyledCurrencyInput = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const StyledInput = styled.input`
    background-color: transparent;
    height: 42px;
    padding: 0px;
    color: ${props => props.theme.colors.white};
    -webkit-appearance: none;
    -moz-appearance: textfield;
    font-weight: 600;
    font-size: ${props => props.theme.sizes.h1}px;
    outline: none;
    text-align: right;
    width: 100%;
    border: none;
`;

const StyledAddressInput = styled.input`
    background-color: transparent;
    height: 42px;
    padding: 0px;
    font-weight: 500;
    font-family: 'Inter';
    color: ${props => props.theme.colors.lightText};
    -webkit-appearance: none;
    -moz-appearance: textfield;
    font-size: ${props => props.theme.sizes.callout}px;
    outline: none;
    text-align: left;
    width: 100%;
    border: none;
`;

const StyledButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
`;

export default SendModal;
