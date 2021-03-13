import React from 'react'
import styled from 'styled-components'
import Page from '../../components/Page'
import {
  useEthereumUsd,
  useFilUsd,
  useUSDCUsd,
} from '../../hooks/useAssetPrices'
import { useRates } from '../../hooks/useRates'
import useSF from '../../hooks/useSecuredFinance'
import { getMoneyMarketContract } from '../../services/sdk/utils'
import theme from '../../theme'
import YieldGraph from './components/Graph'
import PlaceOrder from './components/PlaceOrder'

const Lending: React.FC = () => {
  const securedFinance = useSF()
  const moneyMarketContract = getMoneyMarketContract(securedFinance)
  const borrowRates = useRates(moneyMarketContract, 0)
  const lendingRates = useRates(moneyMarketContract, 1)
  const midRate = useRates(moneyMarketContract, 2)
  const ethPrice = useEthereumUsd()
  const filPrice = useFilUsd()
  const usdcPrice = useUSDCUsd()

  return (
    <Page>
      <StyledLendingContainer>
        <YieldGraph
          borrowRates={borrowRates}
          lendingRates={lendingRates}
          midRate={midRate}
        />
        <PlaceOrder borrowRates={borrowRates} lendingRates={lendingRates} />
      </StyledLendingContainer>
    </Page>
  )
}

const StyledLendingContainer = styled.div`
  width: calc(100% - 208px);
  height: calc(100vh - ${props => props.theme.topBarSize + 1}px);
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

export default Lending
