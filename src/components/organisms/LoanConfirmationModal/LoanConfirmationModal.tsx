import BigNumber from 'bignumber.js';
import React, { useEffect, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import useCollateralBook from 'src/hooks/useCollateralBook';
import { RootState } from 'src/store/types';
import theme from 'src/theme';
import { formatDate, ordinaryFormat, percentFormat } from 'src/utils';
import {
    Button,
    Modal,
    ModalProps,
    ModalActions,
    ModalContent,
    ModalTitle,
    RenderTerms,
} from 'src/components/atoms';

interface LoanModalProps {
    loan?: any;
}

interface ScheduleItem {
    date: number;
    coupon: number;
}

interface NextCoupon {
    dueDate: number;
    notification: number;
    coupon: number;
    usdAmount: number;
}

const initCoupon: NextCoupon = {
    dueDate: 1,
    notification: 1,
    coupon: 0,
    usdAmount: 0,
};

type CombinedProps = ModalProps & LoanModalProps;

const LoanConfirmationModal: React.FC<CombinedProps> = ({
    onDismiss,
    loan,
}) => {
    const [schedule, setSchedule] = useState<Array<ScheduleItem>>([]);
    const [couponPayment, setCouponPayment] = useState<NextCoupon>(initCoupon);
    const [counterpartyAddr, setCounterpartyAddr] = useState('');
    const dispatch = useDispatch();
    const filPrice = useSelector(
        (state: RootState) => state.assetPrices.filecoin.price
    );
    const colBook = useCollateralBook(counterpartyAddr);

    const handleNotional = () => {
        return ordinaryFormat(loan.amt) + ' FIL';
    };

    const handleInterest = () => {
        const interestPayments = totalInterest(loan.amt, loan.rate, loan.term);
        return ordinaryFormat(interestPayments) + ' FIL';
    };

    const totalInterest = (amount: number, rate: number, term: string) => {
        let periods: number;
        const interestRate = new BigNumber(rate).dividedBy(10000).toNumber();
        switch (term) {
            case '0':
                periods = 0.25;
                break;
            case '1':
                periods = 0.5;
                break;
            case '2':
                periods = 1;
                break;
            case '3':
                periods = 2;
                break;
            case '4':
                periods = 3;
                break;
            case '5':
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
        const interestPayments = totalInterest(loan.amt, loan.rate, loan.term);
        const totalRepay = new BigNumber(loan.amt)
            .plus(interestPayments)
            .toNumber();
        return ordinaryFormat(totalRepay) + ' FIL';
    };

    const constructSchedule = () => {
        const parsedScheduleDates: Array<ScheduleItem> = [];
        for (let i = 0; i < loan.schedule[1].length; i++) {
            const item: ScheduleItem = {
                date: loan.schedule[1][i],
                coupon: loan.schedule[2][i],
            };
            parsedScheduleDates.push(item);
        }
        setSchedule(parsedScheduleDates);
    };

    const nextCouponPayment = () => {
        const payment = loan.schedule[2][0];
        const usdAmount = new BigNumber(payment)
            .multipliedBy(filPrice)
            .toNumber();
        const nextCoupon: NextCoupon = {
            dueDate: loan.schedule[1][0],
            coupon: payment,
            notification: loan.schedule[0][0],
            usdAmount: usdAmount,
        };
        setCouponPayment(nextCoupon);
    };

    const handleCounterpartyAddr = () => {
        if (loan.side === '0') {
            setCounterpartyAddr(loan.borrower);
        } else {
            setCounterpartyAddr(loan.lender);
        }
    };

    useEffect(() => {
        constructSchedule();
        nextCouponPayment();
        handleCounterpartyAddr();
    }, [dispatch, setSchedule, setCouponPayment, setCounterpartyAddr]);

    return (
        <Modal>
            <ModalTitle text='Loan Confirmation' />
            <ModalContent paddingBottom={'0'} paddingTop={'0'}>
                <StyledSubcontainer>
                    <StyledLabelContainer>
                        <StyledLabelTitle textTransform={'capitalize'}>
                            Loan Information
                        </StyledLabelTitle>
                    </StyledLabelContainer>
                    <StyledItemContainer background={'none'}>
                        <StyledRowContainer>
                            <StyledItemText>Principal Amount</StyledItemText>
                            <StyledItemText>{handleNotional()}</StyledItemText>
                        </StyledRowContainer>
                        <StyledRowContainer marginTop={'10px'}>
                            <StyledItemText>Maturity Date</StyledItemText>
                            <StyledItemText>
                                {formatDate(loan.end)}
                            </StyledItemText>
                        </StyledRowContainer>
                        <StyledRowContainer marginTop={'10px'}>
                            <StyledItemText>Term</StyledItemText>
                            <StyledItemText>
                                <RenderTerms index={loan.term} />
                            </StyledItemText>
                        </StyledRowContainer>
                        <StyledRowContainer marginTop={'10px'}>
                            <StyledItemText>Interest Rate</StyledItemText>
                            <StyledItemText>
                                {percentFormat(loan.rate, 10000)}
                            </StyledItemText>
                        </StyledRowContainer>
                        <StyledRowContainer marginTop={'10px'}>
                            <StyledItemText>Estimated Interest</StyledItemText>
                            <StyledItemText>{handleInterest()}</StyledItemText>
                        </StyledRowContainer>
                        <StyledRowContainer marginTop={'10px'}>
                            <StyledItemText>Total Debt</StyledItemText>
                            <StyledItemText>
                                {handleTotalRepay()}
                            </StyledItemText>
                        </StyledRowContainer>
                    </StyledItemContainer>
                </StyledSubcontainer>
                {colBook.vault !== '' ? (
                    <CounterpartyContainer>
                        <StyledSubcontainer>
                            <StyledLabelTitle textTransform={'capitalize'}>
                                Counterparty Information
                            </StyledLabelTitle>
                            <StyledItemContainer marginBottom={'0px'}>
                                {/* <StyledRowContainer>
                                <StyledItemText>ETH Address</StyledItemText>
                                <StyledItemText>
                                    {formatAddress(colBook.ethAddr, 24)}
                                </StyledItemText>
                            </StyledRowContainer> */}
                                {/* <StyledRowContainer marginTop={"10px"}>
                                <StyledItemText>FIL Address</StyledItemText>
                                <StyledItemText>
                                    {formatAddress(colBook[0].filAddr, 24)}
                                </StyledItemText>
                            </StyledRowContainer> */}
                            </StyledItemContainer>
                        </StyledSubcontainer>
                        <StyledSubcontainer marginBottom={'0px'}>
                            <StyledLabelTitle textTransform={'capitalize'}>
                                Provided Collateral
                            </StyledLabelTitle>
                            <StyledItemContainer marginBottom={'0px'}>
                                {/* <StyledRowContainer>
                                <StyledItemText>Collateral amount</StyledItemText>
                                <StyledItemText>
                                    {ordinaryFormat(colBook[0].collateral) + " ETH"}
                                </StyledItemText>
                            </StyledRowContainer>
                            <StyledRowContainer marginTop={"10px"}>
                                <StyledItemText>Coverage</StyledItemText>
                                <StyledItemText>
                                    {percentFormat(colBook[0].coverage)}
                                </StyledItemText>
                            </StyledRowContainer> */}
                            </StyledItemContainer>
                        </StyledSubcontainer>
                    </CounterpartyContainer>
                ) : null}
            </ModalContent>
            <ModalActions>
                <Button
                    // onClick={handleLendOut}
                    text={'Lend out'}
                    style={{
                        background: theme.colors.buttonBlue,
                        fontSize: theme.sizes.callout,
                        fontWeight: 500,
                        color: theme.colors.white,
                    }}
                    // disabled={!(amount > 0)}
                />
            </ModalActions>
        </Modal>
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

export default connect(mapStateToProps)(LoanConfirmationModal);
