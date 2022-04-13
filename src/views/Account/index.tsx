import React, { useEffect, useMemo, useState } from 'react';
import { connect, useSelector } from 'react-redux';
import styled from 'styled-components';
import { useWallet } from 'use-wallet';
import { Page } from 'src/components/templates';
import useCollateralBook from 'src/hooks/useCollateralBook';
import { useEthereumWalletStore } from 'src/hooks/useEthWallet';
import { useFilecoinWalletStore } from 'src/hooks/useFilWallet';
import { RootState } from 'src/store/types';
import { WalletBase } from 'src/store/wallets';
import theme from 'src/theme';
import { usdFormat } from 'src/utils';
import CollateralTable from './components/CollateralTable';
import WalletsTable from './components/WalletsTable';
import { getFilAddress, getTotalUSDBalance } from 'src/store/wallets/selectors';
import { FIL_ADDRESS } from 'src/store/wallets/constants';

const Account: React.FC = () => {
    const totalUSDBalance = useSelector(getTotalUSDBalance);
    const ethWallet = useEthereumWalletStore();
    const filWallet = useFilecoinWalletStore();
    const [tableData, setTableData] = useState([] as Array<WalletBase>);
    const { account }: { account: string } = useWallet();
    const colBook = useCollateralBook(account);
    const filAddress = useSelector(getFilAddress);

    useMemo(() => {
        async function updateTable() {
            const array = [];
            array.push(ethWallet, filWallet);
            setTableData(array);
        }
        updateTable();
    }, [ethWallet, filWallet, totalUSDBalance, setTableData]);

    useEffect(() => {
        if (filAddress) {
            localStorage.setItem(FIL_ADDRESS, filAddress);
        }
    }, [filAddress]);

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
                    </StyledBalanceContainer>
                </StyledPortfolioBalance>
                <StyledAccountContainer marginTop={'3px'}>
                    <StyledTitle fontWeight={500} marginBottom={35}>
                        Wallets
                    </StyledTitle>
                    <WalletsTable table={tableData} />
                </StyledAccountContainer>
                {account !== null && (
                    <StyledAccountContainer
                        marginTop={'35px'}
                        marginBottom={'35px'}
                    >
                        <StyledTitle fontWeight={500} marginBottom={35}>
                            Collateral Positions
                        </StyledTitle>
                        <CollateralTable table={[colBook]} />
                    </StyledAccountContainer>
                )}
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
