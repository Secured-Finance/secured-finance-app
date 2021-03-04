import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import {connect} from 'react-redux';

import Container from '../../components/Container'
import HistoryTable from '../../components/HistoryTable'
import Page from '../../components/Page'
import Terms from '../../components/Terms'
import useLoanHistory, { useBorrowHistory, useLoanState } from '../../hooks/useLoanHistory'
import theme from '../../theme'
import { RootState } from '../../store/types';
import { failSetLendingHistory, setLendingHistory, startSetHistory } from '../../store/history';
import { Dispatch } from '@reduxjs/toolkit';

const History: React.FC = () => {
	const loanHistory = useLoanHistory();
	const borrowHistory = useBorrowHistory();

	return (
		<Page background={theme.colors.background}>
			<Container>
				{
					loanHistory.length === 0 
					?
					null
					:
					<div>
					<StyledHistoryTitleContainer>
						<StyledHistoryTitle>Lending  history</StyledHistoryTitle>
						<StyledTermsContainer>
							<Terms/>
						</StyledTermsContainer>
					</StyledHistoryTitleContainer>
					<StyledHistoryContainer>
						<HistoryTable table={loanHistory}/>
					</StyledHistoryContainer>
					</div>
				}
				{
					borrowHistory.length === 0 
					?
					null
					:
					<div>
					<StyledHistoryTitleContainer>
						<StyledHistoryTitle>Borrowing  history</StyledHistoryTitle>
					</StyledHistoryTitleContainer>
					<StyledHistoryContainer>
						<HistoryTable table={borrowHistory}/>
					</StyledHistoryContainer>
					</div>
				}
			</Container>
		</Page>
  	)
}

const StyledHistoryTitleContainer = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	padding-top: ${(props) => props.theme.spacing[5]}px;
	padding-bottom: ${(props) => props.theme.spacing[5]}px;
	padding-left: ${(props) => props.theme.spacing[5]}px;
	padding-right: ${(props) => props.theme.spacing[5]}px;  
`

const StyledTermsContainer = styled.div`
	width: 25%;
`

const StyledHistoryTitle = styled.p`
  font-style: normal;
  font-weight: 400;
  font-size: ${(props) => props.theme.sizes.h1}px;
  color: ${(props) => props.theme.colors.white};
  margin: 0px;
`

const StyledHistoryContainer = styled.div`
	padding-left: ${(props) => props.theme.spacing[5]}px;
	padding-right: ${(props) => props.theme.spacing[5]}px;
`

const mapStateToProps = (state: RootState) => {
    return {
      lendingHistory: state.history,
    }
}
  
const mapDispatchToProps = (dispatch: Dispatch) => {
	return {
		setLendingHistory: (data: any[]) => dispatch(setLendingHistory(data)),  
		startSetHistory: () => dispatch(startSetHistory()),
		failSetLendingHistory: () => dispatch(failSetLendingHistory()),	
	}
}
export default connect(mapStateToProps, mapDispatchToProps)(History)