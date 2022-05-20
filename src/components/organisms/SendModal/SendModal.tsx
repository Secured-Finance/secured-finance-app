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
import { useEthBalance } from 'src/hooks/useEthWallet';
import { useFilecoinWalletInfo } from 'src/hooks/useFilWallet';
import { useSendEth } from 'src/hooks/useSendEth';
import { useSendFil } from 'src/hooks/useSendFil';
import { getAssetInfo } from 'src/store/assetPrices/selectors';
import { RootState } from 'src/store/types';
import { getFilActions } from 'src/store/wallets/selectors';
import theme from 'src/theme';
import { formatInput } from 'src/utils';
import { CurrencyInfo } from 'src/utils/currencyList';
import styled from 'styled-components';
import { isAddress } from 'web3-utils';
import { ErrorModal } from './components/ErrorModal';
import { FilTxFeeTable } from './components/FilTxFeeTable';
import { GasTabsAndTable } from './components/GastabsAndTable';

const SendModal = ({
    onDismiss,
    amount,
    currencyInfo,
    toAddress,
}: {
    amount?: number;
    currencyInfo: CurrencyInfo;
    toAddress?: string;
} & ModalProps) => {
    const [addrErr, setAddrErr] = useState(false);
    const [balanceErr, setBalanceErr] = useState(false);
    const [ongoingTx, setOngoingTx] = useState(false);
    const [recipientAddress, setRecipientAddress] = useState(toAddress ?? '');
    const [amountToSend, setAmountToSend] = useState(amount ?? 0);

    const ethBalance = useEthBalance();
    const { filecoinBalance } = useFilecoinWalletInfo();
    const filecoinActions = useSelector(getFilActions);

    const { price } = useSelector(getAssetInfo(currencyInfo.shortName));

    const TotalUsdAmount = useMemo(
        () => (amountToSend * price).toFixed(2),
        [amountToSend, price]
    );

    const { maxTxFee, gasPrice } = useSelector(
        (state: RootState) => state.sendForm
    );

    const maxFilTxFee = Number(maxTxFee.toFil());

    const handleRecipientAddress = (e: React.FormEvent<HTMLInputElement>) => {
        setRecipientAddress(e.currentTarget.value);
    };

    const renderBalance = useMemo(() => {
        switch (currencyInfo.indexCcy) {
            case 0:
                return (
                    <span>
                        {ethBalance} {currencyInfo.shortName}
                    </span>
                );
            case 1:
                return (
                    <span>
                        {filecoinBalance} {currencyInfo.shortName}
                    </span>
                );
            case 2:
                // TODO: Add USDC balances
                return <span>0.00 {currencyInfo.shortName}</span>;
        }
    }, [
        currencyInfo.indexCcy,
        currencyInfo.shortName,
        ethBalance,
        filecoinBalance,
    ]);

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
                        new BigNumber(ethBalance)
                    );
                case 1:
                    return +amount + maxFilTxFee <= filecoinBalance;
            }
        },
        [currencyInfo.indexCcy, ethBalance, maxFilTxFee, filecoinBalance]
    );

    const handleSendAmount = (e: React.FormEvent<HTMLInputElement>) => {
        setAmountToSend(+e.currentTarget.value);
        if (!isEnoughBalance(e.currentTarget.value)) {
            setBalanceErr(true);
        } else {
            setBalanceErr(false);
        }
    };

    const handleSendModalClose = () => {
        if (!ongoingTx) onDismiss();
    };

    const { onSendEth } = useSendEth(amountToSend, recipientAddress, gasPrice);
    const { sendFil } = useSendFil(
        amountToSend,
        recipientAddress,
        handleSendModalClose,
        setOngoingTx
    );

    const handleTransferAssets = useCallback(async () => {
        try {
            if (recipientAddress !== '' && amountToSend > 0) {
                if (isValidAddress()) {
                    setOngoingTx(true);
                    const txHash =
                        currencyInfo.indexCcy === 0
                            ? await onSendEth()
                            : await sendFil();
                    if (!txHash) {
                        setOngoingTx(false);
                    } else {
                        if (!ongoingTx) onDismiss();
                    }
                } else {
                    setAddrErr(true);
                }
            } else {
                setAddrErr(true);
            }
        } catch (e) {
            console.error(e);
        }
    }, [
        recipientAddress,
        amountToSend,
        isValidAddress,
        currencyInfo.indexCcy,
        onSendEth,
        sendFil,
        ongoingTx,
        onDismiss,
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

    if (currencyInfo.indexCcy === 1 && !filecoinActions) {
        return (
            <ErrorModal
                title={'Connection error'}
                text={
                    'Ledger seems to be disconnected. Please reconnect the device and try again'
                }
                onClose={onCloseSendModal}
            />
        );
    }

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
                            Balance: {renderBalance}
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
            </ModalContent>
            <ModalActions>
                <StyledButtonContainer>
                    <Button
                        text='Cancel'
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
                    />
                    <Spacer size={'md'} />
                    <Button
                        onClick={handleTransferAssets}
                        text={getSendButtonText()}
                        style={{
                            background: theme.colors.buttonBlue,
                            fontSize: theme.sizes.callout,
                            fontWeight: 500,
                            color: theme.colors.white,
                        }}
                        disabled={isSendButtonDisabled()}
                    />
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
