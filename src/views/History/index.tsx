import { Dispatch } from '@reduxjs/toolkit';
import React from 'react';
import { connect } from 'react-redux';
import { Container } from 'src/components/atoms';
import { Page } from 'src/components/templates';
import { useBorrowDeals, useLoanDeals } from 'src/hooks/useLoanHistory';
import {
    failSetLendingHistory,
    setLendingHistory,
    startSetHistory,
} from 'src/store/history';
import { HistoryTableData } from 'src/store/history/types';
import { RootState } from 'src/store/types';
import theme from 'src/theme';
import styled from 'styled-components';
import { HistoryTable } from './components';

const History: React.FC = () => {
    const loans = useLoanDeals();
    const borrows = useBorrowDeals();

    return (
        <Page background={theme.colors.background}>
            <Container>
                {loans.length === 0 ? null : (
                    <div>
                        <StyledHistoryTitleContainer>
                            <StyledHistoryTitle>
                                Lending history
                            </StyledHistoryTitle>
                        </StyledHistoryTitleContainer>
                        <StyledHistoryContainer>
                            <HistoryTable table={loans} />
                        </StyledHistoryContainer>
                    </div>
                )}
                {borrows.length === 0 ? null : (
                    <div>
                        <StyledHistoryTitleContainer>
                            <StyledHistoryTitle>
                                Borrowing history
                            </StyledHistoryTitle>
                        </StyledHistoryTitleContainer>
                        <StyledHistoryContainer>
                            <HistoryTable table={borrows} />
                        </StyledHistoryContainer>
                    </div>
                )}
            </Container>
        </Page>
    );
};

const StyledHistoryTitleContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    padding-top: ${props => props.theme.spacing[5]}px;
    padding-bottom: ${props => props.theme.spacing[5]}px;
    padding-left: ${props => props.theme.spacing[5]}px;
    padding-right: ${props => props.theme.spacing[5]}px;
`;

const StyledHistoryTitle = styled.p`
    font-style: normal;
    font-weight: 400;
    font-size: ${props => props.theme.sizes.h1}px;
    color: ${props => props.theme.colors.white};
    margin: 0px;
`;

const StyledHistoryContainer = styled.div`
    padding-left: ${props => props.theme.spacing[5]}px;
    padding-right: ${props => props.theme.spacing[5]}px;
`;

const mapStateToProps = (state: RootState) => {
    return {
        lendingHistory: state.history,
    };
};

const mapDispatchToProps = (dispatch: Dispatch) => {
    return {
        setLendingHistory: (data: HistoryTableData[]) =>
            dispatch(setLendingHistory(data)),
        startSetHistory: () => dispatch(startSetHistory()),
        failSetLendingHistory: () => dispatch(failSetLendingHistory()),
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(History);
