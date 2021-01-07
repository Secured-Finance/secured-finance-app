import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import styled, { ThemeContext } from 'styled-components'
import theme from '../../../theme';
import Button from '../../../components/Button';
import { LendingStore } from '../../../store/lending/types';
import { RootState } from '../../../store/types';
import { connect, useDispatch, useSelector } from 'react-redux';
import { updateBorrowAmount, updateMainCurrency, updateBorrowRate, updateCollateralAmount, updateMainCollateralCurrency, updateMainTerms } from '../../../store/lending';
import { useSetUpCollateral } from '../../../hooks/useSetUpCollateral';
import { useExecuteLoan } from '../../../hooks/useExecuteLoan';
import { useUpsizeCollateral } from '../../../hooks/useUpSizeCollateral';
import { terms, collateralList, currencyList, percentFormat, formatInput } from '../../../utils';
import CurrencySelector from '../../../components/CurrencySelector';
import TermsSelector from '../../../components/TermsSelector';

interface BorrowTabProps {
    borrowRates: any[]
}

type CombinedProps = BorrowTabProps & LendingStore;
const prices = [551.24, 30.54, 1]

const Borrow: React.FC<CombinedProps> = ({ borrowRates, selectedCcy, selectedCcyName, currencyIndex, collateralCcy, collateralCcyName, selectedTerms, termsIndex, collateralAmount, borrowAmount, borrowRate, }) => {
    const dispatch = useDispatch();
    const ethPrice = useSelector((state: RootState) => state.assetPrices.ethereum.price);
    const filPrice = useSelector((state: RootState) => state.assetPrices.filecoin.price);
    const usdcPrice = useSelector((state: RootState) => state.assetPrices.usdc.price);

    const [requestedCollateral, setRequestedCollateral] = useState(false)
    const [pendingTx, setPendingTx] = useState(false)
    const [buttonOpen, setButtonOpen] = useState(false)
    const [collateralOpen, setCollateralOpen] = useState(false)
    const [termsOpen, setTermsOpen] = useState(false)

    const { onSetUpCollateral } = useSetUpCollateral(collateralAmount, 'did:sample_1', 'cid_FIL_1')
    const handleCollateralPayment = useCallback(async () => {
        try {
            setRequestedCollateral(true)
            const txHash = await onSetUpCollateral()
            if (!txHash) {
                setRequestedCollateral(false)
            }
        } catch (e) {
            console.log(e)
        }
    }, [onSetUpCollateral, setRequestedCollateral])

    const { onUpsizeCollateral } = useUpsizeCollateral(collateralAmount, 0)
    const { onLoanDeal } = useExecuteLoan('0x4f9c57D70a2Dd981cDa60262736a3Fd9517088aB', 1, currencyIndex, termsIndex, borrowAmount)
    const handleBorrowDeal = useCallback(async () => {
        try {
            setPendingTx(true)
            await onLoanDeal()
            setPendingTx(false)
        } catch (e) {
            console.log(e)
        }
    }, [onLoanDeal])

    const handleButtonClick = useCallback((buttonOpen:boolean) => {
        setButtonOpen(!buttonOpen)
    },[setButtonOpen])

    const handleTermsClick = useCallback((termsOpen:boolean) => {
        setTermsOpen(!termsOpen)
    },[setTermsOpen])

    const handleCollateralClick = useCallback((collateralOpen:boolean) => {
        setCollateralOpen(!collateralOpen)
    },[setCollateralOpen])

    const handleCurrencySelect = useCallback((value:string, buttonOpen:boolean) => {
        dispatch(updateMainCurrency(value))
        setButtonOpen(!buttonOpen)
    }, [dispatch, setButtonOpen])

    const handleTermSelect = useCallback((value:string, termsOpen:boolean) => {
        dispatch(updateMainTerms(value))
        setTermsOpen(!termsOpen)
    }, [dispatch, setTermsOpen])

    const handleCollateralSelect = useCallback((value:string, collateralOpen:boolean) => {
        dispatch(updateMainCollateralCurrency(value))
        setCollateralOpen(!collateralOpen)
    }, [dispatch, setCollateralOpen])

    const getBorrowRateForTerm = useEffect(() => {
        if (borrowRates.length > 0) {
            dispatch(updateBorrowRate(borrowRates[currencyIndex][termsIndex]))
        }
    }, [dispatch, currencyIndex, termsIndex])

    // const fullBalance = useMemo(() => {
    //     return getFullDisplayBalance(max)
    // }, [max])

    // const handleSelectMax = useCallback(() => {
    //     setCollateralAmount(fullBalance)
    // }, [fullBalance, setCollateralAmount])

    const TotalUsdAmount = useMemo(() => {
        switch (selectedCcy) {
            case "FIL":
                return (borrowAmount*filPrice).toFixed(2)
            case "ETH":
                return (borrowAmount*ethPrice).toFixed(2)
            case "USDC":
                return (borrowAmount*usdcPrice).toFixed(2)
            default: 
                return 0
        }
    },[borrowAmount, selectedCcy])
    
    const handleBorrow = useCallback((e: React.FormEvent<HTMLInputElement>) => {
        dispatch(updateBorrowAmount(e.currentTarget.value))
    },[dispatch])

    const handleCollateral = useCallback((e: React.FormEvent<HTMLInputElement>) => {
        dispatch(updateCollateralAmount(e.currentTarget.value))
    },[dispatch])

    return (
        <StyledLoanContainer>
            <StyledLoanSubcontainer>
                <StyledLabelContainer>
                    <StyledLoanLabel fontWeight={400} textTransform={"capitalize"}>Currency</StyledLoanLabel>
                    <StyledLoanLabel fontWeight={400} textTransform={"capitalize"}>Balance: $ 0.00</StyledLoanLabel>
                </StyledLabelContainer>
                <StyledInputContainer>
                    <StyledLabelContainer>
                        <StyledLoanLabel marginBottom={4} color={theme.colors.white} textTransform={"capitalize"} fontSize={16}>{selectedCcyName}</StyledLoanLabel>
                        <StyledLoanLabel fontWeight={400} marginBottom={4} textTransform={"capitalize"} fontSize={16}>~ ${TotalUsdAmount}</StyledLoanLabel>
                    </StyledLabelContainer>
                    <StyledCurrencyInput>
                        <CurrencySelector selectedCcy={selectedCcy} onClick={() => handleButtonClick(buttonOpen)} />
                        <StyledLoanInput 
                            type={'number'}
                            placeholder={'0'}
                            value={borrowAmount}
                            minLength={1}
                            maxLength={79}
                            onKeyDown={formatInput}
                            onChange={handleBorrow}
                        />
                    </StyledCurrencyInput>
                </StyledInputContainer>
                { buttonOpen 
                    ? 
                    <StyledDropdown>
                        <ul>
                            {
                                currencyList.map((ccy, i) => (
                                    <StyledDropdownItem 
                                        key={i}
                                        onClick={() => handleCurrencySelect(ccy.shortName, buttonOpen)}
                                    >
                                        <img width={28} src={ccy.icon}/>
                                        <StyledCurrencyText>{ccy.shortName}</StyledCurrencyText>
                                    </StyledDropdownItem>
                                ))
                            }
                        </ul>
                    </StyledDropdown> 
                    : 
                    null 
                }
            </StyledLoanSubcontainer>
            <StyledLoanSubcontainer>
                <StyledLabelContainer>
                    <StyledLoanLabel fontWeight={400} textTransform={"capitalize"}>Borrow terms</StyledLoanLabel>
                    <StyledLoanLabel fontWeight={400} textTransform={"capitalize"}>Rate (APY)</StyledLoanLabel>
                </StyledLabelContainer>
                <StyledInputContainer>
                    <StyledLabelContainer>
                        <StyledLoanLabel marginBottom={4} color={theme.colors.white} textTransform={"capitalize"} fontSize={16}>Fixed</StyledLoanLabel>
                    </StyledLabelContainer>
                    <StyledCurrencyInput>
                        <TermsSelector
                            selectedTerm={selectedTerms}
                            onClick={() => handleTermsClick(termsOpen)}
                        />
                        <StyledLoanInput 
                            placeholder={'0'}
                            value={percentFormat(borrowRate, 10000)}
                            disabled={true}
                        />
                    </StyledCurrencyInput>
                </StyledInputContainer>
                { termsOpen 
                    ? 
                    <StyledDropdown>
                        <ul>
                            {
                                terms.map((term, i) => (
                                    <StyledDropdownItem 
                                        key={i}
                                        onClick={() => handleTermSelect(term.term, termsOpen)}
                                    >
                                        <StyledCurrencyText>{term.text}</StyledCurrencyText>
                                    </StyledDropdownItem>
                                ))
                            }
                        </ul>
                    </StyledDropdown> 
                    : 
                    null 
                }
            </StyledLoanSubcontainer>
            <StyledLoanSubcontainer>
                <StyledLabelContainer>
                    <StyledLoanLabel fontWeight={400} textTransform={"capitalize"}>Collateral currency</StyledLoanLabel>
                    <StyledLoanLabel fontWeight={400} textTransform={"capitalize"}>Minimum 125%</StyledLoanLabel>
                </StyledLabelContainer>
                <StyledInputContainer>
                    <StyledLabelContainer>
                        <StyledLoanLabel marginBottom={4} color={theme.colors.white} textTransform={"capitalize"} fontSize={16}>{collateralCcyName}</StyledLoanLabel>
                    </StyledLabelContainer>
                    <StyledCurrencyInput>
                        <CurrencySelector selectedCcy={collateralCcy} onClick={() => handleCollateralClick(collateralOpen)} type={"collateral"}/>
                        <StyledLoanInput 
                            type={'number'}
                            placeholder={'0'}
                            value={collateralAmount}
                            minLength={1}
                            maxLength={79}
                            onKeyDown={formatInput}
                            onChange={handleCollateral}
                        />
                    </StyledCurrencyInput>
                </StyledInputContainer>
                { collateralOpen 
                    ? 
                    <StyledDropdown>
                        <ul>
                            {
                                collateralList.map((ccy, i) => (
                                    <StyledDropdownItem 
                                        key={i}
                                        onClick={() => handleCollateralSelect(ccy.shortName, collateralOpen)}
                                    >
                                        <img width={28} src={ccy.icon}/>
                                        <StyledCurrencyText>{ccy.shortName}</StyledCurrencyText>
                                    </StyledDropdownItem>
                                ))
                            }
                        </ul>
                    </StyledDropdown> 
                    : 
                    null 
                }
            </StyledLoanSubcontainer>
            <StyledButtonContainer>
                <Button 
                    variant={'orange'} 
                    size={"lg"} 
                    onClick={onUpsizeCollateral}
                    style={{fontSize:16, fontWeight: 600, background: 'rgba(0, 122, 255, 1)', color: theme.colors.white}}
                > Borrow</Button>
                {/* {
                requestedCollateral
                ?
                <Button 
                    variant={'orange'} 
                    size={"lg"} 
                    onClick={handleBorrowDeal}
                    style={{fontSize:16, fontWeight: 600, background: 'rgba(0, 122, 255, 1)', color: theme.colors.white}}
                > Borrow</Button>
                :
                <Button 
                    size={"lg"} 
                    onClick={handleCollateralPayment}
                    style={{fontSize:16, fontWeight: 600, background: 'rgba(0, 122, 255, 1)', color: theme.colors.white}}
                > Place collateral</Button>
                } */}
            </StyledButtonContainer>
            <StyledLabelContainer>
                <StyledLoanLabel fontWeight={400} textTransform={"capitalize"}>Coupon payment</StyledLoanLabel>
                <StyledLoanLabel fontSize={12} fontWeight={400} textTransform={"capitalize"} color={theme.colors.red}>0$</StyledLoanLabel>
            </StyledLabelContainer>
            <StyledLabelContainer>
                <StyledLoanLabel fontWeight={400} textTransform={"capitalize"}>Transaction fee</StyledLoanLabel>
                <StyledLoanLabel fontSize={12} fontWeight={400} textTransform={"capitalize"}>1.2$</StyledLoanLabel>
            </StyledLabelContainer>
        </StyledLoanContainer>
    );
}

const StyledLoanContainer = styled.div`
    margin-top: ${(props) => props.theme.spacing[3]+4}px;
    margin-bottom: ${(props) => props.theme.spacing[3]+4}px;
    display: flex;
    flex-direction: column;
    padding: 0 ${(props) => props.theme.spacing[3]+4}px;
`

const StyledLabelContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`

const StyledLoanSubcontainer = styled.div`
    margin-bottom: ${(props) => props.theme.spacing[4]}px;
`

interface StyledLoanLabelProps {
    textTransform?: string,
    fontWeight?: number,
    fontSize?: number,
    marginBottom?: number,
}

const StyledLoanLabel = styled.div<StyledLoanLabelProps>`
    text-transform: ${(props) => props.textTransform ? props.textTransform : 'uppercase' };
    font-size: ${(props) => props.fontSize ? props.fontSize : props.theme.sizes.subhead}px;
    margin-bottom: ${(props) => props.marginBottom ? props.marginBottom : props.theme.sizes.caption3-3}px;
    margin-top: 0px;
    font-weight: ${(props) => props.fontWeight ? props.fontWeight :600};
    color: ${props => props.color ? props.color : props.theme.colors.gray};
`

const StyledInputContainer = styled.div`
    display: flex;
    flex-direction: column;
    padding: 12px 18px;
    border: 1px solid ${(props) => props.theme.colors.darkenedBg};
    border-radius: 10px;
`

const StyledCurrencyInput = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`

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
`

const StyledButtonContainer = styled.div`
    margin-top: -4px;
    margin-bottom: 20px;
`

interface StyledCurrencyTextProps {
    marginLeft?: string;
}

const StyledCurrencyText = styled.p<StyledCurrencyTextProps>`
    margin: 0;
    margin-left: ${(props) => props.marginLeft ? props.marginLeft : '7px'};
    text-align: left;
`

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
`

const StyledDropdownItem = styled.li`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 8px 8px;
    border-bottom: 0.5px solid ${(props) => props.theme.colors.lightGray[1]};
`

const mapStateToProps = (state: RootState) => state.lending;

export default connect(mapStateToProps)(Borrow);
