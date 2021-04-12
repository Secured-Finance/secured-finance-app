import React from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Page from '../../components/Page'
import { useEthereumUsd, useFilUsd, useUSDCUsd } from '../../hooks/useAssetPrices'
import { useRates } from '../../hooks/useRates'
import useSF from '../../hooks/useSecuredFinance'
import { getLendingControllerContract, getLendingMarketAddress, getLendingMarketContract } from '../../services/sdk/utils'
import { LendingStore } from '../../store/lending'
import { RootState } from '../../store/types'
import theme from '../../theme'
import YieldGraph from './components/Graph'
import PlaceOrder from './components/PlaceOrder'

const Lending: React.FC<LendingStore> = ({ currencyIndex }) => {
	const securedFinance = useSF()
	const lendingController = getLendingControllerContract(securedFinance)
	const borrowRates = useRates(lendingController, 0, currencyIndex)
	const lendingRates = useRates(lendingController, 1, currencyIndex)
	const midRate = useRates(lendingController, 2, currencyIndex)
	const ethPrice = useEthereumUsd()
	const filPrice = useFilUsd()
	const usdcPrice = useUSDCUsd()

	return (
		<Page background={theme.colors.background}>
			<StyledLendingContainer>
				<YieldGraph  
					borrowRates={borrowRates}
					lendingRates={lendingRates}
					midRate={midRate}
				/>
				<PlaceOrder 
					borrowRates={borrowRates}
					lendingRates={lendingRates}
				/>
			</StyledLendingContainer>
		</Page>
	)
}

const StyledLendingContainer = styled.div`
	width: calc(100% - 208px);
	height: calc(100vh - ${props => props.theme.topBarSize+1}px);
	padding-left: 104px;
	padding-right: 104px;
    display: flex;
    flex-direction: row;
	// column-gap: 40px;
	justify-content: space-around;
	align-items: center;
	
		// @media (max-width: 400px) {
		// 		width: auto;
		// }
`

const mapStateToProps = (state: RootState) => state.lending;

export default connect(mapStateToProps)(Lending);