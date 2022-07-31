import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useCollateralBook } from 'src/hooks';
import { RootState } from 'src/store/types';
import { WalletBase } from 'src/store/wallets';
import { getTotalUSDBalance } from 'src/store/wallets/selectors';
import { usdFormat } from 'src/utils';
import styled from 'styled-components';
import { useWallet } from 'use-wallet';
import CollateralTable from './components/CollateralTable';
import WalletsTable from './components/WalletsTable';

const Account: React.FC = () => {
    const totalUSDBalance = useSelector(getTotalUSDBalance);
    const { filecoin: filWallet, ethereum: ethWallet } = useSelector(
        (state: RootState) => state.wallets
    );

    const [tableData, setTableData] = useState<Array<WalletBase>>([]);
    const { account } = useWallet();
    const colBook = useCollateralBook(account);

    useEffect(() => {
        async function updateTable() {
            setTableData([ethWallet, filWallet]);
        }
        updateTable();
    }, [ethWallet, filWallet]);

    return (
        <div role='main' data-cy='account-page'>
            <AccountContainer>
                <StyledPortfolioBalance>
                    <StyledTitle>Total Portfolio Balance</StyledTitle>
                    <StyledBalanceContainer>
                        <StyledBalanceAmount>
                            {totalUSDBalance !== null
                                ? usdFormat(totalUSDBalance)
                                : 0}
                        </StyledBalanceAmount>
                    </StyledBalanceContainer>
                </StyledPortfolioBalance>
                <StyledAccountContainer marginTop={'3px'}>
                    <StyledTitle fontWeight={500} marginBottom={35}>
                        Wallets
                    </StyledTitle>
                    <WalletsTable table={tableData} />
                </StyledAccountContainer>
                {account && (
                    <StyledAccountContainer
                        marginTop={'35px'}
                        marginBottom={'35px'}
                    >
                        <StyledTitle fontWeight={500} marginBottom={35}>
                            Collateral Deposits
                        </StyledTitle>
                        <CollateralTable table={[colBook]} />
                    </StyledAccountContainer>
                )}
            </AccountContainer>
        </div>
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

export default Account;
