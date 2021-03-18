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
import { Subheader } from "../../../../components/common/Subheader"
import { Table, Cell, CellKey, CellValue } from "../../../../components/common/Table";

export const Balances: React.FC = () => {
    const totalUSDBalance = useTotalUSDBalance()
    const ethWallet = useEthereumWalletStore()
    const filWallet = useFilecoinWalletStore()
    const { account }: { account: string } = useWallet()
    const colBook = useCollateralBook(account)

    const [onPresentCollateralModal] = useModal(<CollateralModal ccyIndex={0}/>)

    return (
        <BalanceContainer>
            <Subheader>Balance Information</Subheader>
            <Table>
                <Cell>
                    <CellKey>Account Value</CellKey>
                    <CellValue>{totalUSDBalance != null ? usdFormat(totalUSDBalance) : 0}</CellValue>
                </Cell>
                <Cell>
                    <CellKey>ETH Balance</CellKey>
                    <CellValue>{ethWallet.balance != null ? ordinaryFormat(ethWallet.balance) : 0} ETH</CellValue>
                </Cell>
                <Cell style={{marginBottom: 20}}>
                    <CellKey>FIL Balance</CellKey>
                    <CellValue>{filWallet.balance != null ? ordinaryFormat(filWallet.balance) : 0} FIL</CellValue>
                </Cell>
                <Cell>
                    <CellKey>ETH Collateral</CellKey>
                    {
                        account && colBook.length > 0
                        ?
                        <CellValue>{colBook[0].collateral != null ? ordinaryFormat(colBook[0].collateral) : 0} ETH</CellValue>
                        :
                        <CellValue>{ordinaryFormat(0)} ETH</CellValue>
                    }
                </Cell>
                <Cell>
                    <CellKey>Borrow up to</CellKey>
                    <CellValue>10 000 FIL</CellValue>
                </Cell>
            </Table>
            <Button
                onClick={onPresentCollateralModal}
                text={"Manage Collateral"}
                style={{
                    background: 'transparent',
                    fontSize: theme.sizes.subhead,
                    fontWeight: 500,
                    color: theme.colors.primaryBlue,
                    borderColor: theme.colors.primaryBlue,
                    borderRadius: 4,
                }}
            />
        </BalanceContainer>
    );
}

const BalanceContainer = styled.div`
    display: grid;
    margin-bottom: 15px;
`