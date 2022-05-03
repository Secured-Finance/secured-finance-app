import BigNumber from 'bignumber.js';
import React, { useEffect, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Button, Container, RenderTerms, Spacer } from 'src/components/atoms';
import { Page } from 'src/components/templates';
import useCollateralBook from 'src/hooks/useCollateralBook';
import { useLoanInformation } from 'src/hooks/useLoanHistory';
import { RootState } from 'src/store/types';
import theme from 'src/theme';
import {
    AddressUtils,
    DEFAULT_COLLATERAL_VAULT,
    formatDate,
    fromBytes32,
    getDisplayBalance,
    ordinaryFormat,
    percentFormat,
    usdFormat,
} from 'src/utils';
import styled from 'styled-components';
import { useWallet } from 'use-wallet';

interface LoanScreenProps {
    loan?: any;
}

interface CouponPayment {
    amount: number;
    id: number | string;
    isDone: boolean;
    notice: number;
    payment: number;
    txHash: string;
    __typename?: string;
}

const initCoupon: CouponPayment = {
    amount: 0,
    id: 0,
    isDone: false,
    notice: 1648016979,
    payment: 1649226579,
    txHash: '0x',
    __typename: 'SchedulePayment',
};

type CombinedProps = LoanScreenProps;

const LoanScreen: React.FC<CombinedProps> = () => {
    const params: any = useParams();
    const { account } = useWallet();
    const loan = useLoanInformation(params.loanId);
    const [couponPayment, setCouponPayment] = useState<CouponPayment>();
    const [counterpartyAddr, setCounterpartyAddr] = useState('');
    const dispatch = useDispatch();
    const filPrice = useSelector(
        (state: RootState) => state.assetPrices.filecoin.price
    );
    const colBook = useCollateralBook(
        counterpartyAddr ? counterpartyAddr : '',
        DEFAULT_COLLATERAL_VAULT
    );

    const getLoanCcy = (currency: string) => {
        return fromBytes32(currency);
    };

    const handleNotional = () => {
        return (
            ordinaryFormat(loan?.notional) + ` ${getLoanCcy(loan?.currency)}`
        );
    };

    const handleInterest = () => {
        const interestPayments = totalInterest(
            loan?.notional,
            loan?.rate,
            loan?.term
        );
        const ccy = getLoanCcy(loan?.currency);
        return ordinaryFormat(interestPayments) + ` ${ccy}`;
    };

    const totalInterest = (amount: number, rate: number, term: string) => {
        let periods: number;
        const interestRate = new BigNumber(rate).dividedBy(10000).toNumber();
        switch (term) {
            case '90':
                periods = 0.25;
                break;
            case '180':
                periods = 0.5;
                break;
            case '365':
                periods = 1;
                break;
            case '730':
                periods = 2;
                break;
            case '1095':
                periods = 3;
                break;
            case '1825':
                periods = 5;
                break;
            default:
                break;
        }
        const interestPayments = new BigNumber(amount)
            .multipliedBy(interestRate)
            .multipliedBy(periods)
            .toNumber();
        return interestPayments;
    };

    const handleTotalRepay = () => {
        const interestPayments = totalInterest(
            loan?.notional,
            loan?.rate,
            loan?.term
        );
        const totalRepay = new BigNumber(loan?.notional)
            .plus(interestPayments)
            .toNumber();

        return ordinaryFormat(totalRepay) + ` ${getLoanCcy(loan?.currency)}`;
    };

    const nextCouponPayment = () => {
        const payment: Array<CouponPayment> =
            loan?.schedule.payments?.filter((payment: any) => {
                return payment.isDone === false;
            }) || [];
        setCouponPayment(payment[0]);
    };

    const couponUsdPayment = (amount: number) => {
        const usdPayment = new BigNumber(amount)
            .multipliedBy(filPrice)
            .toNumber();
        return usdFormat(usdPayment);
    };

    const handleCounterpartyAddr = () => {
        if (loan.lender === account.toLowerCase()) {
            setCounterpartyAddr(loan?.borrower);
        } else {
            setCounterpartyAddr(loan?.lender);
        }
    };

    useEffect(() => {
        if (loan != null) {
            nextCouponPayment();
            handleCounterpartyAddr();
        }
    }, [dispatch, setCouponPayment, setCounterpartyAddr, loan, account]);

    return (
        <Page background={theme.colors.background}>
            <Container>
                <StyledPortfolioBalance>
                    <StyledTitle>Loan Agreement Details</StyledTitle>
                </StyledPortfolioBalance>
                <StyledInfoContainer>
                    <StyledColumn>
                        <StyledSubcontainer>
                            <StyledLabelContainer>
                                <StyledLabelTitle textTransform={'capitalize'}>
                                    Loan Information
                                </StyledLabelTitle>
                            </StyledLabelContainer>
                            <StyledItemContainer background={'none'}>
                                <StyledRowContainer>
                                    <StyledItemText>
                                        Principal notional
                                    </StyledItemText>
                                    <StyledItemText>
                                        {handleNotional()}
                                    </StyledItemText>
                                </StyledRowContainer>
                                <StyledRowContainer marginTop={'10px'}>
                                    <StyledItemText>Start Date</StyledItemText>
                                    <StyledItemText>
                                        {formatDate(loan?.startTimestamp)}
                                    </StyledItemText>
                                </StyledRowContainer>
                                <StyledRowContainer marginTop={'10px'}>
                                    <StyledItemText>
                                        Maturity Date
                                    </StyledItemText>
                                    <StyledItemText>
                                        {formatDate(loan?.endTimestamp)}
                                    </StyledItemText>
                                </StyledRowContainer>
                                <StyledRowContainer marginTop={'10px'}>
                                    <StyledItemText>Term</StyledItemText>
                                    <StyledItemText>
                                        <RenderTerms index={loan?.term} />
                                    </StyledItemText>
                                </StyledRowContainer>
                                <StyledRowContainer marginTop={'10px'}>
                                    <StyledItemText>
                                        Interest Rate
                                    </StyledItemText>
                                    <StyledItemText>
                                        {percentFormat(loan?.rate, 10000)}
                                    </StyledItemText>
                                </StyledRowContainer>
                                <StyledRowContainer marginTop={'10px'}>
                                    <StyledItemText>
                                        Daily Interest Rate
                                    </StyledItemText>
                                    <StyledItemText>
                                        {percentFormat(loan?.rate, 3650000)}
                                    </StyledItemText>
                                </StyledRowContainer>
                                <StyledRowContainer marginTop={'10px'}>
                                    <StyledItemText>
                                        Estimated Interest
                                    </StyledItemText>
                                    <StyledItemText>
                                        {handleInterest()}
                                    </StyledItemText>
                                </StyledRowContainer>
                                <StyledRowContainer marginTop={'10px'}>
                                    <StyledItemText>Total Debt</StyledItemText>
                                    <StyledItemText>
                                        {handleTotalRepay()}
                                    </StyledItemText>
                                </StyledRowContainer>
                            </StyledItemContainer>
                        </StyledSubcontainer>
                        <StyledSubcontainer marginBottom={'0px'}>
                            <StyledLabelTitle textTransform={'capitalize'}>
                                Payment Schedule
                            </StyledLabelTitle>
                            <StyledItemContainer
                                marginBottom={'0px'}
                                background={'none'}
                            >
                                {loan?.schedule.payments?.map(
                                    (item: CouponPayment, i: number) => (
                                        <StyledRowContainer
                                            key={i}
                                            marginTop={'10px'}
                                        >
                                            <StyledItemText>
                                                {formatDate(item.payment)}
                                            </StyledItemText>
                                            <StyledItemText>
                                                {ordinaryFormat(item.amount) +
                                                    ` ${getLoanCcy(
                                                        loan?.currency
                                                    )}`}
                                            </StyledItemText>
                                        </StyledRowContainer>
                                    )
                                )}
                                <Button
                                    // onClick={handleLendOut}
                                    text={'Request Early Termination'}
                                    style={{
                                        marginTop: 15,
                                        background: 'transparent',
                                        fontSize: theme.sizes.callout,
                                        fontWeight: 500,
                                        color: theme.colors.white,
                                        borderColor: theme.colors.buttonBlue,
                                        borderBottom: theme.colors.buttonBlue,
                                    }}
                                    // disabled={!(notional > 0)}
                                />
                            </StyledItemContainer>
                        </StyledSubcontainer>
                    </StyledColumn>
                    <Spacer size='lg' />
                    <StyledColumn>
                        <StyledSubcontainer>
                            <StyledLabelTitle textTransform={'capitalize'}>
                                Next Coupon Payment
                            </StyledLabelTitle>
                            <StyledItemContainer
                                marginBottom={'0px'}
                                background={'none'}
                            >
                                <StyledRowContainer>
                                    <StyledItemText
                                        fontSize={16}
                                        fontWeight={600}
                                    >
                                        {ordinaryFormat(couponPayment?.amount) +
                                            ` ${getLoanCcy(loan?.currency)}`}
                                    </StyledItemText>
                                    <StyledItemText color={theme.colors.gray}>
                                        {couponUsdPayment(
                                            couponPayment?.amount
                                        )}
                                    </StyledItemText>
                                </StyledRowContainer>
                                <StyledRowContainer marginTop={'10px'}>
                                    <StyledItemText
                                        fontSize={12}
                                        opacity={0.9}
                                        fontWeight={400}
                                    >
                                        Payment Notification
                                    </StyledItemText>
                                    <StyledItemText
                                        fontSize={12}
                                        fontWeight={400}
                                    >
                                        {formatDate(couponPayment?.notice)}
                                    </StyledItemText>
                                </StyledRowContainer>
                                <StyledRowContainer marginTop={'10px'}>
                                    <StyledItemText
                                        fontSize={12}
                                        opacity={0.9}
                                        fontWeight={400}
                                    >
                                        Payment Due Date
                                    </StyledItemText>
                                    <StyledItemText
                                        fontSize={12}
                                        fontWeight={400}
                                    >
                                        {formatDate(couponPayment?.payment)}
                                    </StyledItemText>
                                </StyledRowContainer>
                                <Button
                                    // onClick={handleLendOut}
                                    text={'Pay Coupon'}
                                    style={{
                                        marginTop: 15,
                                        background: theme.colors.buttonBlue,
                                        fontSize: theme.sizes.callout,
                                        fontWeight: 500,
                                        color: theme.colors.white,
                                    }}
                                    // disabled={!(notional > 0)}
                                />
                            </StyledItemContainer>
                        </StyledSubcontainer>
                        {colBook.vault !== '' ? (
                            <CounterpartyContainer>
                                <StyledSubcontainer>
                                    <StyledLabelTitle
                                        textTransform={'capitalize'}
                                    >
                                        Counterparty Information
                                    </StyledLabelTitle>
                                    <StyledItemContainer marginBottom={'0px'}>
                                        <StyledRowContainer>
                                            <StyledItemText>
                                                ETH Address
                                            </StyledItemText>
                                            <StyledItemText>
                                                {AddressUtils.format(
                                                    counterpartyAddr,
                                                    20
                                                )}
                                            </StyledItemText>
                                        </StyledRowContainer>
                                        <StyledRowContainer marginTop={'10px'}>
                                            <StyledItemText>
                                                Collateral amount
                                            </StyledItemText>
                                            <StyledItemText>
                                                {getDisplayBalance(
                                                    new BigNumber(
                                                        colBook.collateral.toString()
                                                    )
                                                ) + ' ETH'}
                                            </StyledItemText>
                                        </StyledRowContainer>
                                        {/* <StyledRowContainer marginTop={"10px"}>
                                    <StyledItemText>Coverage</StyledItemText>
                                    <StyledItemText>
                                        {percentFormat(colBook[0].coverage)}
                                    </StyledItemText>
                                </StyledRowContainer> */}
                                        {/* <StyledRowContainer marginTop={"10px"}>
                                    <StyledItemText>{fromBytes32(loan?.currency)} Address</StyledItemText>
                                    <StyledItemText>
                                        {formatAddress(colBook[0].filAddr, 24)}
                                    </StyledItemText>
                                </StyledRowContainer> */}
                                    </StyledItemContainer>
                                </StyledSubcontainer>
                            </CounterpartyContainer>
                        ) : null}
                    </StyledColumn>
                </StyledInfoContainer>
            </Container>
        </Page>
    );
};

interface StyledSubcontainerProps {
    marginBottom?: string;
}

const StyledSubcontainer = styled.div<StyledSubcontainerProps>`
    margin-bottom: ${props => (props.marginBottom ? props.marginBottom : 30)}px;
`;

const CounterpartyContainer = styled.div``;

interface StyledLabelProps {
    textTransform?: string;
    fontWeight?: number;
    fontSize?: number;
    marginBottom?: number;
}

interface TitleProps {
    fontWeight?: number;
    marginBottom?: number;
}

const StyledColumn = styled.div`
    flex: 1;
`;

const StyledTitle = styled.p<TitleProps>`
    font-style: normal;
    font-weight: ${props => (props.fontWeight ? props.fontWeight : 400)};
    font-size: ${props => props.theme.sizes.h1}px;
    color: ${props => props.theme.colors.white};
    margin: 0px;
    margin-bottom: ${props => (props.marginBottom ? props.marginBottom : 0)}px;
`;

const StyledPortfolioBalance = styled.div`
    display: flex;
    flex-direction: column;
    // justify-content: space-between;
    // align-items: center;
    padding-top: 59px;
    padding-left: 175px;
    padding-right: 175px;
`;

const StyledInfoContainer = styled.div`
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    // justify-content: space-between;
    // align-items: center;
    padding-top: 38px;
    padding-bottom: 51px;
    padding-left: 175px;
    padding-right: 175px;
`;

const StyledLabelContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
`;

const StyledLabelTitle = styled.div<StyledLabelProps>`
    text-transform: ${props =>
        props.textTransform ? props.textTransform : 'uppercase'};
    font-size: ${props =>
        props.fontSize ? props.fontSize : props.theme.sizes.callout}px;
    margin-bottom: ${props => (props.marginBottom ? props.marginBottom : 15)}px;
    margin-top: 0px;
    font-weight: ${props => (props.fontWeight ? props.fontWeight : 500)};
    color: ${props => (props.color ? props.color : props.theme.colors.white)};
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
    background?: string;
}

const StyledItemContainer = styled.div<StyledAddressContainerProps>`
    background: ${props =>
        props.background ? props.background : 'rgb(18, 39, 53, 0.7)'};
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    border: 1px solid ${props => props.theme.colors.darkenedBg};
    border-radius: 3px;
    margin-bottom: ${props =>
        props.marginBottom ? props.marginBottom : '20px'};

    div:first-child {
        margin-top: 0px;
    }
`;

interface StyledItemTextProps {
    fontSize?: number;
    color?: string;
    opacity?: number;
    fontWeight?: number;
}

const StyledItemText = styled.p<StyledItemTextProps>`
    margin: 0;
    color: ${props => (props.color ? props.color : props.theme.colors.white)};
    font-size: ${props =>
        props.fontSize ? props.fontSize : props.theme.sizes.subhead}px;
    opacity: ${props => (props.opacity ? props.opacity : 1)};
    font-weight: ${props => (props.fontWeight ? props.fontWeight : 400)};
    letter-spacing: 0.03em;
`;

const mapStateToProps = (state: RootState) => {
    return {
        assetPrices: state.assetPrices,
    };
};

export default connect(mapStateToProps)(LoanScreen);
