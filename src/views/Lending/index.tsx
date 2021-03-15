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
  width: 80%;
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  height: 100%;

  @media (max-width: 769px) {
    flex-direction: column;
    width: 100%;
  }
`

export default Lending
