import React from "react"
import styled from "styled-components";
import { useWallet } from "use-wallet";
import Button from "../../../../components/Button";
import CollateralModal from "../../../../components/CollateralModal";
import useCollateralBook from "../../../../hooks/useCollateralBook";
import { useEthereumWalletStore } from "../../../../hooks/useEthWallet";
import { useFilecoinWalletStore } from "../../../../hooks/useFilWallet";
import useModal from "../../../../hooks/useModal";
import { useTotalUSDBalance } from "../../../../hooks/useTotalUSDBalance";
import theme from "../../../../theme";
import { ordinaryFormat, usdFormat } from "../../../../utils";

export const Balances: React.FC = () => {
    const totalUSDBalance = useTotalUSDBalance()
    const ethWallet = useEthereumWalletStore()
    const filWallet = useFilecoinWalletStore()
    const { account }: { account: string } = useWallet()
    const colBook = useCollateralBook(account)

    const [onPresentCollateralModal] = useModal(<CollateralModal ccyIndex={0}/>)

    return (
        <StyledBalances>
            <StyledBalancesTitle>Balance Information</StyledBalancesTitle>
            <StyledBalanceInfoContainer>
                <StyledBalanceInfoItem>
                    <StyledBalanceInfoText color={theme.colors.gray}>Account Value</StyledBalanceInfoText>
                    <StyledBalanceInfoText>{totalUSDBalance != null ? usdFormat(totalUSDBalance) : 0}</StyledBalanceInfoText>
                </StyledBalanceInfoItem>
                <StyledBalanceInfoItem>
                    <StyledBalanceInfoText color={theme.colors.gray}>ETH Balance</StyledBalanceInfoText>
                    <StyledBalanceInfoText>{ethWallet.balance != null ? ordinaryFormat(ethWallet.balance) : 0} ETH</StyledBalanceInfoText>
                </StyledBalanceInfoItem>
                <StyledBalanceInfoItem marginBottom={20}>
                    <StyledBalanceInfoText color={theme.colors.gray}>FIL Balance</StyledBalanceInfoText>
                    <StyledBalanceInfoText>{filWallet.balance != null ? ordinaryFormat(filWallet.balance) : 0} FIL</StyledBalanceInfoText>
                </StyledBalanceInfoItem>
                <StyledBalanceInfoItem>
                    <StyledBalanceInfoText color={theme.colors.gray}>ETH Collateral</StyledBalanceInfoText>
                    {
                        account && colBook.length > 0
                        ?
                        <StyledBalanceInfoText>{colBook[0].collateral != null ? ordinaryFormat(colBook[0].collateral) : 0} ETH</StyledBalanceInfoText>
                        :
                        <StyledBalanceInfoText>{ordinaryFormat(0)} ETH</StyledBalanceInfoText>
                    }
                </StyledBalanceInfoItem>
                <StyledBalanceInfoItem>
                    <StyledBalanceInfoText color={theme.colors.gray}>Borrow up to</StyledBalanceInfoText>
                    <StyledBalanceInfoText>10 000 FIL</StyledBalanceInfoText>
                </StyledBalanceInfoItem>
            </StyledBalanceInfoContainer>
            <Button 
                onClick={onPresentCollateralModal}
                text={"Manage Collateral"}
                style={{
                    background: 'transparent',
                    fontSize: theme.sizes.caption, 
                    fontWeight: 600,
                    color: theme.colors.white,
                    borderColor: '#2D7CF7',
                    borderWidth: 0.5,
                    borderBottom: "#2D7CF7",
                    borderRadius: 2,
                }}
            />
        </StyledBalances>
    );
}

const StyledBalances = styled.div`
    display: grid;
    margin-bottom: 15px;
`

const StyledBalancesTitle = styled.h6`
	text-transform: capitalize;
    font-size: ${(props) => props.theme.sizes.caption}px;
    margin-bottom: ${(props) => props.theme.sizes.caption3}px;
    margin-top: 0;
    font-weight: 600;
    line-height: 15px;
    color: ${props => props.theme.colors.white};
`

interface StyledBalanceInfoProps {
    color?: string
    marginBottom?: number
}

const StyledBalanceInfoContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    text-transform: capitalize;
    font-size: ${(props) => props.theme.sizes.caption2}px;
    margin-top: 0;
    font-weight: 500;
    margin-bottom: ${(props) => props.theme.spacing[2]+2}px;
`

const StyledBalanceInfoItem = styled.div<StyledBalanceInfoProps>`
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    text-transform: capitalize;
    margin-bottom: ${(props) => props.marginBottom ? props.marginBottom: props.theme.spacing[1]+3}px;
`

const StyledBalanceInfoText = styled.p<StyledBalanceInfoProps>`
    margin: 0;
    color: ${props => props.color ? props.color : props.theme.colors.white};
`