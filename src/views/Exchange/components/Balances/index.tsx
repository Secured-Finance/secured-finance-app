import React from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';
import { useWallet } from 'use-wallet';
import { CollateralModal } from 'src/components/organisms';
import { Button } from 'src/components/common/Buttons';
import { Subheader } from 'src/components/common/Subheader';
import { Cell, CellKey, CellValue, Table } from 'src/components/common/Table';
import useCollateralBook from 'src/hooks/useCollateralBook';
import { useEthereumWalletStore } from 'src/hooks/useEthWallet';
import { useFilecoinWalletStore } from 'src/hooks/useFilWallet';
import useModal from 'src/hooks/useModal';
import { getTotalUSDBalance } from 'src/store/wallets/selectors';
import { getDisplayBalance, ordinaryFormat, usdFormat } from 'src/utils';

export const Balances: React.FC = () => {
    const totalUSDBalance = useSelector(getTotalUSDBalance);
    const ethWallet = useEthereumWalletStore();
    const filWallet = useFilecoinWalletStore();
    const { account }: { account: string } = useWallet();
    const colBook = useCollateralBook(account);

    const [onPresentCollateralModal] = useModal(
        <CollateralModal ccyIndex={0} />
    );

    return (
        <BalanceContainer>
            <Subheader>Balance Information</Subheader>
            <Table>
                <Cell>
                    <CellKey>Account Value</CellKey>
                    <CellValue>
                        {totalUSDBalance != null
                            ? usdFormat(totalUSDBalance)
                            : 0}
                    </CellValue>
                </Cell>
                <Cell>
                    <CellKey>ETH Balance</CellKey>
                    <CellValue>
                        {ethWallet.balance != null
                            ? ordinaryFormat(ethWallet.balance)
                            : 0}{' '}
                        ETH
                    </CellValue>
                </Cell>
                <Cell style={{ marginBottom: 20 }}>
                    <CellKey>FIL Balance</CellKey>
                    <CellValue>
                        {filWallet.balance != null
                            ? ordinaryFormat(filWallet.balance)
                            : 0}{' '}
                        FIL
                    </CellValue>
                </Cell>
                <Cell>
                    <CellKey>ETH Collateral</CellKey>
                    {account && colBook.vault !== '' ? (
                        <CellValue>
                            {colBook.collateral != null
                                ? getDisplayBalance(colBook.collateral)
                                : 0}{' '}
                            ETH
                        </CellValue>
                    ) : (
                        <CellValue>{ordinaryFormat(0)} ETH</CellValue>
                    )}
                </Cell>
                <Cell>
                    <CellKey>Borrow up to</CellKey>
                    <CellValue>10 000 FIL</CellValue>
                </Cell>
            </Table>
            <Button onClick={onPresentCollateralModal} outline>
                Manage Collateral
            </Button>
        </BalanceContainer>
    );
};

const BalanceContainer = styled.div`
    display: grid;
    margin-bottom: 15px;
`;
