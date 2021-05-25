import React, { useMemo, useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { useWallet } from 'use-wallet';
import Page from '../../components/Page';
import useCollateralBook from '../../hooks/useCollateralBook';
import { useEthereumWalletStore } from '../../hooks/useEthWallet';
import { useFilecoinWalletStore } from '../../hooks/useFilWallet';
import { useTotalUSDBalance } from '../../hooks/useTotalUSDBalance';
import { RootState } from '../../store/types';
import { WalletBase } from '../../store/wallets';
import theme from '../../theme';
import { usdFormat } from '../../utils';
import CollateralTable from './components/CollateralTable';
import WalletsTable from './components/WalletsTable';

const Account: React.FC = () => {
    const totalUSDBalance = useTotalUSDBalance();
    const ethWallet = useEthereumWalletStore();
    const filWallet = useFilecoinWalletStore();
    const [tableData, setTableData] = useState([] as Array<WalletBase>);
    const { account }: { account: string } = useWallet();
    const colBook = useCollateralBook(account);
    useMemo(() => {
        async function updateTable() {
            let array = [];
            array.push(ethWallet, filWallet);
            setTableData(array);
        }
        updateTable();
    }, [ethWallet, filWallet, totalUSDBalance, setTableData]);

    return (
        <Page background={theme.colors.background}>
            <AccountContainer>
                <StyledPortfolioBalance>
                    <StyledTitle>Total Portfolio Balance</StyledTitle>
                    <StyledBalanceContainer>
                        <StyledBalanceAmount>
                            {totalUSDBalance != null
                                ? usdFormat(totalUSDBalance)
                                : 0}
                        </StyledBalanceAmount>
                        {/* <StyledBalanceChange>{ethChange.toFixed(2)}%</StyledBalanceChange> */}
                    </StyledBalanceContainer>
                </StyledPortfolioBalance>
                <StyledAccountContainer marginTop={'3px'}>
                    <StyledTitle fontWeight={500} marginBottom={35}>
                        Wallets
                    </StyledTitle>
                    <WalletsTable table={tableData} />
                </StyledAccountContainer>
                <StyledAccountContainer
                    marginTop={'35px'}
                    marginBottom={'35px'}
                >
                    <StyledTitle fontWeight={500} marginBottom={35}>
                        Collateral Positions
                    </StyledTitle>
                    <CollateralTable table={colBook} />
                </StyledAccountContainer>
            </AccountContainer>
        </Page>
    );
};

const StyledPortfolioBalance = styled.div`
    display: flex;
    flex-direction: column;
    padding-top: ${props => props.theme.spacing[4]}px;
    padding-bottom: 51px;
    padding-left: ${props => props.theme.spacing[5]}px;
    padding-right: ${props => props.theme.spacing[5]}px;
`;

const AccountContainer = styled.div`
    margin: 0 auto;
    padding: 0 ${props => props.theme.spacing[4]}px;
    padding-bottom: ${props => props.theme.spacing[4]}px;
    width: calc(100% - 48px);
    height: calc(100vh - 96px);
    overflow-y: auto;

    ::-webkit-scrollbar {
        display: none;
    }
`;

interface StyledAccountContainerProps {
    marginTop?: string;
    marginBottom?: string;
}

const StyledAccountContainer = styled.div<StyledAccountContainerProps>`
    margin-top: ${props => (props.marginTop ? props.marginTop : '0px')};
    margin-bottom: ${props =>
        props.marginBottom ? props.marginBottom : '0px'};
    padding-left: ${props => props.theme.spacing[5]}px;
    padding-right: ${props => props.theme.spacing[5]}px;
`;

interface TitleProps {
    fontWeight?: number;
    marginBottom?: number;
}

const StyledTitle = styled.p<TitleProps>`
    font-style: normal;
    font-weight: ${props => (props.fontWeight ? props.fontWeight : 400)};
    font-size: ${props => props.theme.sizes.h1}px;
    color: ${props => props.theme.colors.white};
    margin: 0;
    margin-bottom: ${props => (props.marginBottom ? props.marginBottom : 0)}px;
`;

const StyledBalanceContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: flex-end;
`;

const StyledBalanceAmount = styled.p`
    font-style: normal;
    font-weight: 500;
    font-size: ${props => props.theme.sizes.h0}px;
    line-height: ${props => props.theme.sizes.h0 - 2}px;
    color: ${props => props.theme.colors.white};
    margin: ${props => props.theme.sizes.footnote}px 0 0 0;
`;

const mapStateToProps = (state: RootState) => {
    return {
        assetPrices: state.assetPrices,
        wallets: state.wallets,
        filWalletProvider: state.filWalletProvider,
    };
};

export default connect(mapStateToProps)(Account);
