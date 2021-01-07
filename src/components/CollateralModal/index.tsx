import React, { useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import theme from '../../theme'
import Button from '../Button'
import Modal, { ModalProps } from '../Modal'
import ModalActions from '../ModalActions'
import ModalContent from '../ModalContent'
import ModalTitle from '../ModalTitle'
import Spacer from '../Spacer'
import { connect, useDispatch, useSelector } from 'react-redux'
import { RootState } from '../../store/types'
import CurrencySelector from '../CurrencySelector';
import { CollateralFormStore, updateCollateralAmount, updateCollateralCurrency } from '../../store/collateralForm'
import { currencyList, formatInput, percentFormat } from '../../utils'
import { colors } from '../../theme/colors'
import { useEthBalance } from '../../hooks/useEthWallet'
import { useSetUpCollateral } from '../../hooks/useSetUpCollateral'
import { useUpsizeCollateral } from '../../hooks/useUpSizeCollateral'
import useCollateralBook from '../../hooks/useCollateralBook'

type CombinedProps = ModalProps & CollateralFormStore

const CollateralModal: React.FC<CombinedProps> = ({ onDismiss, amount, ccyIndex, isInitiated, currencyIndex, currencyName, currencyShortName, filAddress }) => {
    const [buttonOpen, setButtonOpen] = useState(false)
    const [collateralTx, setCollateralTx] = useState(false)
    const colBook = useCollateralBook()

    const ethBalance = useEthBalance()
    const dispatch = useDispatch()
    const ethPrice = useSelector((state: RootState) => state.assetPrices.ethereum.price);

    let textColor: string = colors.yellow

    const handleButtonClick = useCallback((buttonOpen:boolean) => {
        setButtonOpen(!buttonOpen)
    },[setButtonOpen])

    const handleCurrencySelect = useCallback((value:string, buttonOpen:boolean) => {
        dispatch(updateCollateralCurrency(value))
        setButtonOpen(!buttonOpen)
    },[dispatch, setButtonOpen])

    const handleCollateralAmount = useCallback((e: React.FormEvent<HTMLInputElement>) => {
        dispatch(updateCollateralAmount(e.currentTarget.value))
    },[dispatch])

    const { onSetUpCollateral } = useSetUpCollateral(amount, 'id', filAddress)
    const { onUpsizeCollateral } = useUpsizeCollateral(amount, 0)

    const handleDepositCollateral = useCallback(async () => {
        try {
            setCollateralTx(true)
            if (isInitiated) {
                const txHash = await onUpsizeCollateral()
                if (!txHash) {
                    setCollateralTx(false)
                } else {
                    onDismiss()
                }
            } else {
                const txHash = await onSetUpCollateral()
                if (!txHash) {
                    setCollateralTx(false)
                } else {
                    onDismiss()
                }
            }
        } catch (e) {
            console.log(e)
        }
    }, [onSetUpCollateral, setCollateralTx])

    const renderBalance = useMemo(() => {
        return <span>{ethBalance} {currencyShortName}</span> 
    },[currencyIndex, currencyShortName])

    const TotalUsdAmount = useMemo(() => {
        return (amount*ethPrice).toFixed(2)
    },[amount, currencyShortName])

	return (
		<Modal>
			<ModalTitle text="Collateral" />
			<ModalContent paddingBottom={'0'} paddingTop={'0'}>
                <StyledSubcontainer>
                    <StyledLabelContainer>
                        <StyledLabel textTransform={"capitalize"}>Deposit</StyledLabel>
                        <StyledLabel fontWeight={400} textTransform={"capitalize"}>Balance: {renderBalance}</StyledLabel>
                    </StyledLabelContainer>
                    <StyledInputContainer>
                        <StyledLabelContainer>
                            <StyledLabel marginBottom={4} color={theme.colors.white} textTransform={"capitalize"} fontSize={16}>{currencyName}</StyledLabel>
                            <StyledLabel fontWeight={400} marginBottom={4} textTransform={"capitalize"} fontSize={16}>~ ${TotalUsdAmount}</StyledLabel>
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
                                    maxLength={79}
                                    onKeyDown={formatInput}
                                    onChange={handleCollateralAmount}
                                />
                        </StyledCurrencyInput>
                    </StyledInputContainer>
                    { 
                        buttonOpen 
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
                </StyledSubcontainer>
                <StyledAddressContainer marginBottom={"0px"}>
                    <StyledRowContainer>
                        <StyledAddressTitle>Total collateral position</StyledAddressTitle>
                        <StyledAddress>
                            10,000 ETH
                        </StyledAddress>
                    </StyledRowContainer>
                    <StyledRowContainer marginTop={"10px"}>
                        <StyledAddressTitle>Total collateral position (USD)</StyledAddressTitle>
                        <StyledAddress>
                            $72,956.75
                        </StyledAddress>
                    </StyledRowContainer>
                    <StyledRowContainer marginTop={"10px"}>
                        <StyledAddressTitle>Borrow up to</StyledAddressTitle>
                        <StyledAddress>
                            $45,043
                        </StyledAddress>
                    </StyledRowContainer>
                    <StyledRowContainer marginTop={"10px"}>
                        <StyledAddress>
                            Health ratio
                        </StyledAddress>
                        <StyledHealthRatioText color={textColor}>
                            {percentFormat(75)}
                        </StyledHealthRatioText>
                    </StyledRowContainer>
                </StyledAddressContainer>
			</ModalContent>
			<ModalActions>
                <StyledButtonContainer>
                    <Button 
                        text="Cancel"
                        onClick={onDismiss}
                        style={{
                            background: 'transparent',
                            borderWidth: 1,
                            borderColor: theme.colors.buttonBlue,
                            borderBottom: theme.colors.buttonBlue,
                            fontSize: theme.sizes.callout, 
                            fontWeight: 500,
                            color: theme.colors.white
                        }}
                    />
                    <Spacer size={"md"}/>
                    <Button 
                        onClick={handleDepositCollateral}
                        text={"Deposit"}
                        style={{
                            background: theme.colors.buttonBlue,
                            fontSize: theme.sizes.callout, 
                            fontWeight: 500,
                            color: theme.colors.white
                        }}
                        disabled={!(amount > 0)}
                    />
                </StyledButtonContainer>
			</ModalActions>
		</Modal>
	)
}

interface StyledSubcontainerProps {
    marginBottom?: string
}

const StyledSubcontainer = styled.div<StyledSubcontainerProps>`
    margin-bottom: ${(props) => props.marginBottom ? props.marginBottom : props.theme.spacing[4]}px;
`

interface StyledLabelProps {
    textTransform?: string,
    fontWeight?: number,
    fontSize?: number,
    marginBottom?: number,
}

const StyledLabelContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`

const StyledLabel = styled.div<StyledLabelProps>`
    text-transform: ${(props) => props.textTransform ? props.textTransform : 'uppercase' };
    font-size: ${(props) => props.fontSize ? props.fontSize : props.theme.sizes.subhead}px;
    margin-bottom: ${(props) => props.marginBottom ? props.marginBottom : 5}px;
    margin-top: 0px;
    font-weight: ${(props) => props.fontWeight ? props.fontWeight :500};
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

const StyledPortfolioText = styled.div`
    margin-top: 5px;
    font-size: ${(props) => props.theme.sizes.subhead}px;
    color: ${(props) => props.theme.colors.white};
    font-weight: 500;
`

const StyledPortfolioInfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
`

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
`

interface StyledRowContainerProps {
    marginTop?: string
}

const StyledRowContainer = styled.div<StyledRowContainerProps>`
    margin-top: ${props => props.marginTop ? props.marginTop : 0};
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    width: 100%;
`

interface StyledHealthRatioTextProps {
    color?: string
}

const StyledHealthRatioText = styled.div<StyledHealthRatioTextProps>`
    font-size: ${(props) => props.theme.sizes.subhead}px;
    color: ${(props) => props.color ? props.color : props.theme.colors.white};
    font-weight: 500;
`

interface StyledAddressContainerProps {
    marginBottom?: string
}

const StyledAddressContainer = styled.div<StyledAddressContainerProps>`
	background: rgb(18, 39, 53, 0.7);
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;
	padding: 18px;
	border: 1px solid ${(props) => props.theme.colors.darkenedBg};
	border-top: 0;
    border-radius: 10px;
    margin-bottom: ${(props) => props.marginBottom ? props.marginBottom : '20px'};
`

const StyledButtonContainer = styled.div`
    display: flex;
    flex-direction: row;
`

const StyledAddressTitle = styled.p`
	margin: 0;
	color: ${props => props.theme.colors.gray};
	font-size: ${props => props.theme.sizes.subhead}px;
`

const StyledAddress = styled.p`
	margin: 0;
	color: ${props => props.theme.colors.gray};
	font-size: ${props => props.theme.sizes.subhead}px;
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

const StyledGasTabs = styled.div`
	display: flex;
    flex-direction: row;
    justify-content: center;
	text-transform: uppercase;
	padding: 0;
`

interface StyledCurrencyTextProps {
    marginLeft?: string;
}

const StyledCurrencyText = styled.p<StyledCurrencyTextProps>`
    margin: 0;
    margin-left: ${(props) => props.marginLeft ? props.marginLeft : '7px'};
    text-align: left;
`

const mapStateToProps = (state: RootState) => state.collateralForm;

export default connect(mapStateToProps)(CollateralModal);
