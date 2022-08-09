/* eslint-disable @next/next/no-img-element */
import BigNumber from 'bignumber.js';
import React, { useCallback, useMemo, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import {
    Button,
    Modal,
    ModalActions,
    ModalContent,
    ModalProps,
    ModalTitle,
} from 'src/components/atoms';
import { CurrencySelector } from 'src/components/molecules';
import { useCollateralBook } from 'src/hooks';
import { useDepositCollateral } from 'src/hooks/useDepositCollateral';
import { useEthBalance } from 'src/hooks/useEthWallet';
import { useRegisterUser } from 'src/hooks/useRegisterUser';
import {
    CollateralFormStore,
    updateCollateralAmount,
    updateCollateralCurrency,
} from 'src/store/collateralForm';
import { RootState } from 'src/store/types';
import theme from 'src/theme';
import {
    CurrencyInfo,
    CurrencySymbol,
    formatInput,
    getCurrencyMapAsList,
    getDisplayBalance,
    getFullDisplayBalanceNumber,
    getUSDFormatBalanceNumber,
} from 'src/utils';
import styled from 'styled-components';
import { useWallet } from 'use-wallet';

type CollateralModalProps = {
    status?: boolean;
};

type CombinedProps = ModalProps & CollateralFormStore & CollateralModalProps;

const CollateralModal: React.FC<CombinedProps> = ({
    onDismiss,
    amount,
    currencyIndex,
    currencyName,
    currencyShortName,
    status,
}) => {
    const [buttonOpen, setButtonOpen] = useState(false);
    const [, setCollateralTx] = useState(false);
    const [balanceErr, setBalanceErr] = useState(false);
    const { account } = useWallet();
    const colBook = useCollateralBook(
        account,
        currencyShortName as CurrencySymbol
    );
    const ethBalance = useEthBalance();
    const dispatch = useDispatch();
    const ethPrice = useSelector(
        (state: RootState) => state.assetPrices.ethereum.price
    );

    const handleButtonClick = useCallback(
        (buttonOpen: boolean) => {
            setButtonOpen(!buttonOpen);
        },
        [setButtonOpen]
    );

    const handleCurrencySelect = useCallback(
        (value: CurrencyInfo, buttonOpen: boolean) => {
            dispatch(updateCollateralCurrency(value));
            setButtonOpen(!buttonOpen);
        },
        [dispatch, setButtonOpen]
    );

    const isEnoughBalance = useCallback(
        (amount: number) => {
            switch (currencyIndex) {
                case 0:
                    return new BigNumber(amount).isLessThanOrEqualTo(
                        new BigNumber(ethBalance)
                    );
            }
        },
        [ethBalance, currencyIndex]
    );

    const handleCollateralAmount = useCallback(
        (e: React.FormEvent<HTMLInputElement>) => {
            dispatch(updateCollateralAmount(e.currentTarget.valueAsNumber));
            if (!isEnoughBalance(e.currentTarget.valueAsNumber)) {
                setBalanceErr(true);
            } else {
                setBalanceErr(false);
            }
        },
        [dispatch, isEnoughBalance]
    );

    const { onRegisterUser } = useRegisterUser();
    const { onDepositCollateral } = useDepositCollateral(
        currencyShortName as CurrencySymbol,
        amount
    );

    const handleDepositCollateral = useCallback(async () => {
        try {
            setCollateralTx(true);
            if (status) {
                const txHash = await onDepositCollateral();
                if (!txHash) {
                    setCollateralTx(false);
                } else {
                    onDismiss?.();
                }
            } else {
                const txHash = await onRegisterUser();
                if (!txHash) {
                    setCollateralTx(false);
                } else {
                    onDismiss?.();
                }
            }
        } catch (e) {
            console.error(e);
        }
    }, [status, onDepositCollateral, onDismiss, onRegisterUser]);

    const renderBalance = useMemo(() => {
        return (
            <span>
                {ethBalance} {currencyShortName}
            </span>
        );
    }, [currencyShortName, ethBalance]);

    const TotalUsdAmount = useMemo(() => {
        return (amount * ethPrice).toFixed(2);
    }, [amount, ethPrice]);

    return (
        <Modal>
            <ModalTitle text='Collateral' />
            <ModalContent paddingBottom={'0'} paddingTop={'0'}>
                <StyledSubcontainer>
                    <StyledLabelContainer>
                        <StyledLabel textTransform={'capitalize'}>
                            Deposit
                        </StyledLabel>
                        <StyledLabel
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
                                {currencyName}
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
                            <CurrencySelector
                                selectedCcy={currencyShortName}
                                onClick={() => handleButtonClick(buttonOpen)}
                                disabled={true}
                            />
                            <StyledInput
                                type={'number'}
                                placeholder={'0'}
                                value={amount}
                                minLength={1}
                                disabled={!status}
                                maxLength={79}
                                onKeyDown={formatInput}
                                onChange={handleCollateralAmount}
                                data-cy='collateral-amount-input'
                            />
                        </StyledCurrencyInput>
                    </StyledInputContainer>
                    {buttonOpen ? (
                        <StyledDropdown>
                            <ul>
                                {getCurrencyMapAsList().map((ccy, i) => (
                                    <StyledDropdownItem
                                        key={i}
                                        onClick={() =>
                                            handleCurrencySelect(
                                                ccy,
                                                buttonOpen
                                            )
                                        }
                                    >
                                        <img
                                            width={28}
                                            src={''}
                                            alt={ccy.shortName}
                                        />
                                        <StyledCurrencyText>
                                            {ccy.shortName}
                                        </StyledCurrencyText>
                                    </StyledDropdownItem>
                                ))}
                            </ul>
                        </StyledDropdown>
                    ) : null}
                </StyledSubcontainer>
                <StyledAddressContainer marginBottom={'0px'}>
                    <StyledRowContainer>
                        <StyledAddressTitle>
                            Available collateral position
                        </StyledAddressTitle>
                        {account ? (
                            <StyledAddress>
                                {colBook.collateral !== null
                                    ? getDisplayBalance(colBook.collateral)
                                    : getFullDisplayBalanceNumber(0)}{' '}
                                ETH
                            </StyledAddress>
                        ) : (
                            <StyledAddress>
                                {getFullDisplayBalanceNumber(0)} ETH
                            </StyledAddress>
                        )}
                    </StyledRowContainer>
                    <StyledRowContainer marginTop={'10px'}>
                        <StyledAddressTitle>
                            Available collateral position (USD)
                        </StyledAddressTitle>
                        {account !== '' ? (
                            <StyledAddress>
                                {colBook.usdCollateral !== null
                                    ? getUSDFormatBalanceNumber(
                                          colBook.usdCollateral.toNumber()
                                      )
                                    : getUSDFormatBalanceNumber(0)}
                            </StyledAddress>
                        ) : (
                            <StyledAddress>
                                {getUSDFormatBalanceNumber(0)}
                            </StyledAddress>
                        )}
                    </StyledRowContainer>
                    <StyledRowContainer marginTop={'10px'}>
                        <StyledAddressTitle>
                            Locked collateral
                        </StyledAddressTitle>
                        {account !== '' ? (
                            <StyledAddress>
                                {colBook.locked
                                    ? getDisplayBalance(colBook.locked)
                                    : getFullDisplayBalanceNumber(0)}{' '}
                                ETH
                            </StyledAddress>
                        ) : (
                            <StyledAddress>
                                {getFullDisplayBalanceNumber(0)} ETH
                            </StyledAddress>
                        )}
                    </StyledRowContainer>
                    <StyledRowContainer marginTop={'10px'}>
                        <StyledAddressTitle>
                            Locked collateral (USD)
                        </StyledAddressTitle>
                        {account !== '' ? (
                            <StyledAddress>
                                {colBook.usdLocked
                                    ? getUSDFormatBalanceNumber(
                                          colBook.usdLocked.toNumber()
                                      )
                                    : getUSDFormatBalanceNumber(0)}
                            </StyledAddress>
                        ) : (
                            <StyledAddress>
                                {getUSDFormatBalanceNumber(0)}
                            </StyledAddress>
                        )}
                    </StyledRowContainer>
                </StyledAddressContainer>
            </ModalContent>
            <ModalActions>
                <StyledButtonContainer>
                    <Button onClick={onDismiss}>Cancel</Button>
                    <ButtonWithCommentContainer>
                        {balanceErr && <Comment>Insufficient Amount</Comment>}
                        <Button
                            onClick={handleDepositCollateral}
                            disabled={
                                status ? !(amount > 0) || balanceErr : false
                            }
                        >
                            {status ? 'Deposit' : 'Register'}
                        </Button>
                    </ButtonWithCommentContainer>
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

const StyledInputContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 12px 18px;
    border: 1px solid ${props => props.theme.colors.darkenedBg};
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
    :disabled {
        opacity: 0.5;
    }
`;

interface StyledRowContainerProps {
    marginTop?: string;
}

const StyledRowContainer = styled.div<StyledRowContainerProps>`
    margin-top: ${props => (props.marginTop ? props.marginTop : 0)};
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
`;

interface StyledAddressContainerProps {
    marginBottom?: string;
}

const StyledAddressContainer = styled.div<StyledAddressContainerProps>`
    background: rgb(18, 39, 53, 0.7);
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 18px;
    border: 1px solid ${props => props.theme.colors.darkenedBg};
    border-top: 0;
    border-radius: 10px;
    margin-bottom: ${props =>
        props.marginBottom ? props.marginBottom : '20px'};
`;

const StyledButtonContainer = styled.div`
    display: flex;
    justify-content: space-between;
`;

const StyledAddressTitle = styled.p`
    margin: 0;
    color: ${props => props.theme.colors.gray};
    font-size: ${props => props.theme.sizes.subhead}px;
`;

const StyledAddress = styled.p`
    margin: 0;
    color: ${props => props.theme.colors.gray};
    font-size: ${props => props.theme.sizes.subhead}px;
`;

const StyledDropdown = styled.div`
    position: relative;
    top: -10px;
    left: 20px;

    ul {
        background: white;
        position: absolute;
        z-index: 2;
        min-width: 120px;
        border-radius: 3px;
        list-style: none;
        padding: 0;
        margin: 0;
    }

    li:hover {
        background-color: rgba(232, 232, 233, 0.4);
        cursor: pointer;
    }

    li:last-child {
        border-bottom: none;
    }
`;

const StyledDropdownItem = styled.li`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 8px 8px;
    border-bottom: 0.5px solid ${props => props.theme.colors.lightGray[1]};
`;

interface StyledCurrencyTextProps {
    marginLeft?: string;
}

const StyledCurrencyText = styled.p<StyledCurrencyTextProps>`
    margin: 0;
    margin-left: ${props => (props.marginLeft ? props.marginLeft : '7px')};
    text-align: left;
`;

const ButtonWithCommentContainer = styled.span`
    display: flex;
    align-items: center;
`;

const Comment = styled.span`
    color: ${theme.colors.cellKey};
    margin-right: ${theme.spacing[2]}px;
    font-size: ${theme.sizes.caption2}px;
`;

const mapStateToProps = (state: RootState) => state.collateralForm;

export default connect(mapStateToProps)(CollateralModal);
