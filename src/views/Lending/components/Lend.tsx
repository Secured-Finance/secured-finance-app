import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import Button from 'src/components/Button';
import CurrencySelector from 'src/components/CurrencySelector';
import TermsSelector from 'src/components/TermsSelector';
import { usePlaceOrder } from 'src/hooks/usePlaceOrder';
import {
    updateLendAmount,
    updateLendRate,
    updateMainCurrency,
    updateMainTerms,
} from 'src/store/lending';
import { LendingStore } from 'src/store/lending/types';
import { RootState } from 'src/store/types';
import theme from 'src/theme';
import {
    currencyList,
    formatInput,
    percentFormat,
    terms,
    usdFormat,
} from 'src/utils';
import styled from 'styled-components';

interface LendTabProps {
    lendingRates: any[];
}
type CombinedProps = LendTabProps & LendingStore;

const daysInYear = [90, 180, 360, 720, 1080, 1800];

const Lend: React.FC<CombinedProps> = ({
    lendingRates,
    selectedCcy,
    selectedCcyName,
    selectedTerms,
    lendAmount,
    lendRate,
    currencyIndex,
    termsIndex,
}) => {
    const dispatch = useDispatch();
    const [pendingTx, setPendingTx] = useState(false);
    const ethPrice = useSelector(
        (state: RootState) => state.assetPrices.ethereum.price
    );
    const filPrice = useSelector(
        (state: RootState) => state.assetPrices.filecoin.price
    );
    const usdcPrice = useSelector(
        (state: RootState) => state.assetPrices.usdc.price
    );

    const [buttonOpen, setButtonOpen] = useState(false);
    const [termsOpen, setTermsOpen] = useState(false);

    const handleButtonClick = useCallback(
        (buttonOpen: boolean) => {
            setButtonOpen(!buttonOpen);
        },
        [setButtonOpen]
    );

    const handleOpenTerms = useCallback(
        (termsOpen: boolean) => {
            setTermsOpen(!termsOpen);
        },
        [setTermsOpen]
    );

    const handleCurrencySelect = useCallback(
        (value: string, buttonOpen: boolean) => {
            dispatch(updateMainCurrency(value));
            setButtonOpen(!buttonOpen);
        },
        [dispatch, setButtonOpen]
    );

    const handleTermSelect = useCallback(
        (value: string, termsOpen: boolean) => {
            dispatch(updateMainTerms(value));
            setTermsOpen(!termsOpen);
        },
        [dispatch, setTermsOpen]
    );

    const { onPlaceOrder } = usePlaceOrder(
        selectedCcy,
        selectedTerms,
        0,
        lendAmount,
        lendRate
    );
    const handleLendDeal = useCallback(async () => {
        try {
            setPendingTx(true);
            await onPlaceOrder();
            setPendingTx(false);
        } catch (e) {
            console.log(e);
        }
    }, [onPlaceOrder, setPendingTx]);

    const getLendRateForTerm = useEffect(() => {
        if (lendingRates.length > 0) {
            dispatch(updateLendRate(lendingRates[termsIndex]));
        }
    }, [dispatch, currencyIndex, termsIndex]);

    // const fullBalance = useMemo(() => {
    //     return getFullDisplayBalance(max)
    // }, [max])

    // const handleSelectMax = useCallback(() => {
    //     setCollateralAmount(fullBalance)
    // }, [fullBalance, setCollateralAmount])

    const TotalUsdAmount = useMemo(() => {
        switch (selectedCcy) {
            case 'FIL':
                return lendAmount * filPrice;
            case 'ETH':
                return lendAmount * ethPrice;
            case 'USDC':
                return lendAmount * usdcPrice;
            default:
                return 0;
        }
    }, [lendAmount, selectedCcy]);

    const estimatedReturns = useMemo(() => {
        const interest = lendRate / 10000;
        const p = interest * (daysInYear[termsIndex] / 360);
        let usdAmount: number;
        switch (currencyIndex) {
            case 0:
                usdAmount = lendAmount * ethPrice;
                break;
            case 1:
                usdAmount = lendAmount * filPrice;
                break;
            case 2:
                usdAmount = lendAmount * usdcPrice;
                break;
            default:
                usdAmount = lendAmount * ethPrice;
                break;
        }
        const compoundInterest = usdAmount * p;
        return compoundInterest;
    }, [termsIndex, currencyIndex, lendRate, lendAmount]);

    const handleLend = useCallback(
        (e: React.FormEvent<HTMLInputElement>) => {
            dispatch(updateLendAmount(e.currentTarget.value));
        },
        [dispatch]
    );

    return (
        <StyledLoanContainer>
            <StyledLoanSubcontainer>
                <StyledLabelContainer>
                    <StyledLoanLabel
                        fontWeight={400}
                        textTransform={'capitalize'}
                    >
                        Currency
                    </StyledLoanLabel>
                    <StyledLoanLabel
                        fontWeight={400}
                        textTransform={'capitalize'}
                    >
                        Balance: $ 0.00
                    </StyledLoanLabel>
                </StyledLabelContainer>
                <StyledInputContainer>
                    <StyledLabelContainer>
                        <StyledLoanLabel
                            marginBottom={4}
                            color={theme.colors.white}
                            textTransform={'capitalize'}
                            fontSize={16}
                        >
                            {selectedCcyName}
                        </StyledLoanLabel>
                        <StyledLoanLabel
                            fontWeight={400}
                            marginBottom={4}
                            textTransform={'capitalize'}
                            fontSize={16}
                        >
                            ~ {usdFormat(TotalUsdAmount)}
                        </StyledLoanLabel>
                    </StyledLabelContainer>
                    <StyledCurrencyInput>
                        <CurrencySelector
                            selectedCcy={selectedCcy}
                            onClick={() => handleButtonClick(buttonOpen)}
                        />
                        <StyledLoanInput
                            type={'number'}
                            placeholder={'0'}
                            value={lendAmount}
                            minLength={1}
                            maxLength={79}
                            onKeyDown={formatInput}
                            onChange={handleLend}
                        />
                    </StyledCurrencyInput>
                </StyledInputContainer>
                {buttonOpen ? (
                    <StyledDropdown>
                        <ul>
                            {currencyList.map((ccy, i) => (
                                <StyledDropdownItem
                                    key={i}
                                    onClick={() =>
                                        handleCurrencySelect(
                                            ccy.shortName,
                                            buttonOpen
                                        )
                                    }
                                >
                                    <img width={28} src={ccy.icon} />
                                    <StyledCurrencyText>
                                        {ccy.shortName}
                                    </StyledCurrencyText>
                                </StyledDropdownItem>
                            ))}
                        </ul>
                    </StyledDropdown>
                ) : null}
            </StyledLoanSubcontainer>
            <StyledLoanSubcontainer>
                <StyledLabelContainer>
                    <StyledLoanLabel
                        fontWeight={400}
                        textTransform={'capitalize'}
                    >
                        Loan terms
                    </StyledLoanLabel>
                    <StyledLoanLabel
                        fontWeight={400}
                        textTransform={'capitalize'}
                    >
                        Rate (APY)
                    </StyledLoanLabel>
                </StyledLabelContainer>
                <StyledInputContainer>
                    <StyledLabelContainer>
                        <StyledLoanLabel
                            marginBottom={4}
                            color={theme.colors.white}
                            textTransform={'capitalize'}
                            fontSize={16}
                        >
                            Fixed
                        </StyledLoanLabel>
                    </StyledLabelContainer>
                    <StyledCurrencyInput>
                        <TermsSelector
                            selectedTerm={selectedTerms}
                            onClick={() => handleOpenTerms(termsOpen)}
                        />
                        <StyledLoanInput
                            placeholder={'0'}
                            value={percentFormat(lendRate, 10000)}
                            onChange={() => {
                                /* Do Nothing */
                            }}
                            // disabled={true}
                        />
                    </StyledCurrencyInput>
                </StyledInputContainer>
                {termsOpen ? (
                    <StyledDropdown>
                        <ul>
                            {terms.map((term, i) => (
                                <StyledDropdownItem
                                    key={i}
                                    onClick={() =>
                                        handleTermSelect(term.term, termsOpen)
                                    }
                                >
                                    <StyledCurrencyText>
                                        {term.text}
                                    </StyledCurrencyText>
                                </StyledDropdownItem>
                            ))}
                        </ul>
                    </StyledDropdown>
                ) : null}
            </StyledLoanSubcontainer>
            <StyledButtonContainer>
                <Button
                    size={'lg'}
                    style={{
                        fontSize: 16,
                        fontWeight: 600,
                        background: 'rgba(0, 122, 255, 1)',
                        color: theme.colors.white,
                    }}
                    onClick={handleLendDeal}
                    disabled={pendingTx}
                >
                    Lend
                </Button>
            </StyledButtonContainer>
            <StyledLabelContainer>
                <StyledLoanLabel fontWeight={400} textTransform={'capitalize'}>
                    Estimated returns
                </StyledLoanLabel>
                <StyledLoanLabel
                    fontSize={12}
                    fontWeight={400}
                    textTransform={'capitalize'}
                    color={theme.colors.green}
                >
                    {usdFormat(estimatedReturns)}
                </StyledLoanLabel>
            </StyledLabelContainer>
            <StyledLabelContainer>
                <StyledLoanLabel fontWeight={400} textTransform={'capitalize'}>
                    Transaction fee
                </StyledLoanLabel>
                <StyledLoanLabel
                    fontSize={12}
                    fontWeight={400}
                    textTransform={'capitalize'}
                >
                    1.2$
                </StyledLoanLabel>
            </StyledLabelContainer>
        </StyledLoanContainer>
    );
};

const StyledLoanContainer = styled.div`
    margin-top: ${props => props.theme.spacing[3] + 4}px;
    margin-bottom: ${props => props.theme.spacing[3] + 4}px;
    display: flex;
    flex-direction: column;
    padding: 0 ${props => props.theme.spacing[3] + 4}px;
`;

const StyledLabelContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const StyledLoanSubcontainer = styled.div`
    margin-bottom: ${props => props.theme.spacing[4]}px;
`;

interface StyledLoanLabelProps {
    textTransform?: string;
    fontWeight?: number;
    fontSize?: number;
    marginBottom?: number;
}

const StyledLoanLabel = styled.div<StyledLoanLabelProps>`
    text-transform: ${props =>
        props.textTransform ? props.textTransform : 'uppercase'};
    font-size: ${props =>
        props.fontSize ? props.fontSize : props.theme.sizes.subhead}px;
    margin-bottom: ${props =>
        props.marginBottom
            ? props.marginBottom
            : props.theme.sizes.caption3 - 3}px;
    margin-top: 0px;
    font-weight: ${props => (props.fontWeight ? props.fontWeight : 600)};
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

const StyledLoanInput = styled.input`
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

const StyledButtonContainer = styled.div`
    margin-top: -4px;
    margin-bottom: 20px;
`;

interface StyledCurrencyTextProps {
    marginLeft?: string;
}

const StyledCurrencyText = styled.p<StyledCurrencyTextProps>`
    margin: 0;
    margin-left: ${props => (props.marginLeft ? props.marginLeft : '7px')};
    text-align: left;
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

const mapStateToProps = (state: RootState) => state.lending;

export default connect(mapStateToProps)(Lend);
