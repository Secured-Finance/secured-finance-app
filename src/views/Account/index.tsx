import React, { useMemo, useState } from 'react'
import { connect } from 'react-redux'
import styled from 'styled-components'
import Container from '../../components/Container'
import Page from '../../components/Page'
import { useEthereumWalletStore } from '../../hooks/useEthWalletStore'
import { useTotalUSDBalance } from '../../hooks/useTotalUSDBalance'
import { RootState } from '../../store/types'
import { WalletBase } from '../../store/wallets'
import theme from '../../theme'
import { usdFormat } from '../../utils/formatNumbers'
import WalletsTable from './components/WalletsTable'

const Account: React.FC = () => {
    const totalUSDBalance = useTotalUSDBalance()
    const ethWallet = useEthereumWalletStore()
    const [tableData, setTableData] = useState([] as Array<WalletBase>)

    useMemo(() => {
        async function updateTable() {
            let array = []
            array.push(ethWallet)
            setTableData(array)
        }
        updateTable();
    }, [ethWallet, totalUSDBalance])

	return (
		<Page background={theme.colors.background}>
            <Container>
            <StyledPortfolioBalance>
                <StyledTitle>Total Portfolio Balance</StyledTitle>
                <StyledBalanceContainer>
                    <StyledBalanceAmount>{totalUSDBalance != null ? usdFormat(totalUSDBalance) : 0}</StyledBalanceAmount>
                    {/* <StyledBalanceChange>{ethChange.toFixed(2)}%</StyledBalanceChange> */}
                </StyledBalanceContainer>
            </StyledPortfolioBalance>
            <StyledAccountContainer>
                <StyledTitle fontWeight={500} marginBottom={25}>Wallets</StyledTitle>
                <WalletsTable table={tableData}/>
            </StyledAccountContainer>
            </Container>
		</Page>
	)
}

const StyledPortfolioBalance = styled.div`
	display: flex;
    flex-direction: column;
	// justify-content: space-between;
	// align-items: center;
	padding-top: 59px;
	padding-bottom: 51px;
	padding-left: ${(props) => props.theme.spacing[5]}px;
	padding-right: ${(props) => props.theme.spacing[5]}px;  
`

const StyledAccountContainer = styled.div`
	padding-left: ${(props) => props.theme.spacing[5]}px;
	padding-right: ${(props) => props.theme.spacing[5]}px;
`

interface TitleProps {
    fontWeight?: number
    marginBottom?: number
}

const StyledTitle = styled.p<TitleProps>`
    font-style: normal;
    font-weight: ${(props) => props.fontWeight ? props.fontWeight : 400};
    font-size: ${(props) => props.theme.sizes.h1}px;
    color: ${(props) => props.theme.colors.white};
    margin: 0px;
    margin-bottom: ${(props) => props.marginBottom ? props.marginBottom : 0}px;
`

const StyledBalanceContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-end;
`

const StyledBalanceAmount = styled.p`
    font-style: normal;
    font-weight: 500;
    font-size: ${(props) => props.theme.sizes.h0}px;
    line-height: ${(props) => props.theme.sizes.h0-2}px;
    color: ${(props) => props.theme.colors.white};
    margin: ${(props) => props.theme.sizes.footnote}px 0 0 0;
`

const StyledBalanceChange = styled.p`
    font-style: normal;
    font-weight: 400;
    font-size: ${(props) => props.theme.sizes.body}px;
    color: ${(props) => props.theme.colors.green};
    margin: 0 0 0 14px;
`

const mapStateToProps = (state: RootState) => {
    return {
        assetPrices: state.assetPrices,
        wallets: state.wallets,
    }
}

export default connect(mapStateToProps)(Account);