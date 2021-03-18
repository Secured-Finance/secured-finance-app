import React, { useEffect, useState } from 'react'
import Button from '../../components/Button'
import styled from 'styled-components'
import PositionsTable from '../../components/OpenPositions/PositionsTable'
import { OrderBook } from './components/OrderBook'
import Page from '../../components/Page'
import RateList from '../../components/RateList'
import YieldCurve from '../../components/YieldCurve'
import theme from '../../theme'
import OpenPositions from '../../components/OpenPositions'
import LoanOrder from './components/LoanOrder'
import { TradeHistory } from './components/TradeHistory'
import { Balances } from './components/Balances'
import { MarketInfo } from './components/MarketInfo'

const Exchange: React.FC = () => {

  return (
    <Page background={theme.colors.background}>
		<StyledTerminalContainer>
			<ScrollableSideContainer>
				<Balances />
				<StyledDivider />
				<LoanOrder />
			</ScrollableSideContainer>
			<StyledCenterContainer>
				<MarketInfo />
				<YieldCurve />
				<OpenPositions />
			</StyledCenterContainer>
			<ScrollableSideContainer>
				<OrderBook />
				<StyledDivider />
				<TradeHistory />
			</ScrollableSideContainer>
		</StyledTerminalContainer>
    </Page>
  )
}

const StyledDivider = styled.hr`
	margin: 0;
	width: calc(100% + 30px);
	margin-left: -15px;
	margin-right: -15px;
	border-left: 0;
	border-right: 0;
	border-bottom: 0;
	border-top: 1px solid ${(props) => props.theme.colors.darkenedBg};
`

const StyledTerminalContainer = styled.div`
	flex: 1 1 auto;
    display: grid;
	grid-template-columns: 1.4fr 4fr 1.15fr;
	// min-height: calc(100vh - ${(props) => props.theme.topBarSize + props.theme.spacing[3] + 1}px);
	width: calc(100% - ${(props) => props.theme.spacing[2]*2+4}px);
	padding-left: ${(props) => props.theme.spacing[2]+2}px;
	padding-right: ${(props) => props.theme.spacing[2]+2}px;
	overflow: auto;
`

const ScrollableSideContainer = styled.div`
	border-left: 1px solid ${(props) => props.theme.colors.darkenedBg};
	border-right: 1px solid ${(props) => props.theme.colors.darkenedBg};
	padding-top: ${(props) => props.theme.spacing[3]-1}px !important;
	padding-left: ${(props) => props.theme.spacing[3]-1}px;
	padding-right: ${(props) => props.theme.spacing[3]-1}px;
	padding-bottom: ${theme.sizes.padding}px;
	width: calc(100% - ${(props) => props.theme.spacing[5]-2}px);
	height: calc(100vh - 120px);
	z-index: 1;
	overflow-y: scroll;

	::-webkit-scrollbar {
		display: none;
	}
`

const StyledCenterContainer = styled.div`
    display: flex;
	flex-direction: column;
	overflow: auto;
	// width: calc(100% - ${(props) => props.theme.spacing[3]*2}px);
`

export default Exchange
