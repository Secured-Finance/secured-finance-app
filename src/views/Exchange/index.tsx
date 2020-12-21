import React, { useEffect, useState } from 'react'
import Button from '../../components/Button'
import styled from 'styled-components'
import PositionsTable from '../../components/OpenPositions/PositionsTable'
import { OrderBook } from '../../components/OrderBook'
import Page from '../../components/Page'
import RateList from '../../components/RateList'
import YieldCurve from '../../components/YieldCurve'
import theme from '../../theme'
import OpenPositions from '../../components/OpenPositions'
import LoanOrder from '../../components/LoanOrder'

const Exchange: React.FC = () => {

  return (
    <Page background={theme.colors.background}>
		<StyledTerminalContainer>
			<StyledLeftContainer>
				<RateList />
				<LoanOrder />
			</StyledLeftContainer>
			<StyledCenterContainer>
				<YieldCurve />
				<OpenPositions />
			</StyledCenterContainer>
			<StyledRightContainer>
				<OrderBook />
			</StyledRightContainer>
		</StyledTerminalContainer>
    </Page>
  )
}

const StyledTerminalContainer = styled.div`
	flex: 1 1 auto;
    display: grid;
	grid-template-columns: 1.4fr 4fr 1.4fr;
	// min-height: calc(100vh - ${(props) => props.theme.topBarSize + props.theme.spacing[3] + 1}px);
	width: calc(100% - ${(props) => props.theme.spacing[3]*2}px);
	padding-left: ${(props) => props.theme.spacing[3]}px;
	padding-right: ${(props) => props.theme.spacing[3]}px;
	overflow: auto;
`

const StyledLeftContainer = styled.div`
	border-right: 1px solid ${(props) => props.theme.colors.darkenedBg};
	padding-top: ${(props) => props.theme.spacing[3]}px !important;
	padding-right: ${(props) => props.theme.spacing[3]}px;
	width: calc(100% - ${(props) => props.theme.spacing[3]}px);
	min-height: calc(100vh - ${(props) => props.theme.topBarSize + props.theme.spacing[3] + 1}px);
`

const StyledCenterContainer = styled.div`
    display: flex;
	flex-direction: column;
	overflow: auto;
	// width: calc(100% - ${(props) => props.theme.spacing[3]*2}px);
`

const StyledRightContainer = styled.div`
	border-left: 1px solid ${(props) => props.theme.colors.darkenedBg};
	padding-top: ${(props) => props.theme.spacing[3]}px !important;
	padding-left: ${(props) => props.theme.spacing[3]}px;
	width: calc(100% - ${(props) => props.theme.spacing[3]*1}px);
	min-height: calc(100vh - ${(props) => props.theme.topBarSize + props.theme.spacing[3] + 1}px);
`

export default Exchange
