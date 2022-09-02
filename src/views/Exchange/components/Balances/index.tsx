import React from 'react';
import { useSelector } from 'react-redux';
import { Button } from 'src/components/atoms';
import { Subheader } from 'src/components/common/Subheader';
import { Cell, CellKey, CellValue, Table } from 'src/components/common/Table';
import { useCollateralBook } from 'src/hooks';
import { RootState } from 'src/store/types';
import { getTotalUSDBalance } from 'src/store/wallets/selectors';
import { getDisplayBalance, ordinaryFormat, usdFormat } from 'src/utils';
import styled from 'styled-components';
import { useWallet } from 'use-wallet';

export const Balances: React.FC = () => {
    const totalUSDBalance = useSelector(getTotalUSDBalance);
    const {
        filecoin: { balance: filecoinBalance },
        ethereum: { balance: ethereumBalance },
    } = useSelector((state: RootState) => state.wallets);

    const { account } = useWallet();
    const colBook = useCollateralBook(account);

    return (
        <BalanceContainer>
            <Subheader>Balance Information</Subheader>
            <Table>
                <Cell>
                    <CellKey>Account Value</CellKey>
                    <CellValue>
                        {totalUSDBalance !== null
                            ? usdFormat(totalUSDBalance)
                            : 0}
                    </CellValue>
                </Cell>
                <Cell>
                    <CellKey>ETH Balance</CellKey>
                    <CellValue>
                        {ethereumBalance !== null
                            ? ordinaryFormat(ethereumBalance)
                            : 0}{' '}
                        ETH
                    </CellValue>
                </Cell>
                <Cell style={{ marginBottom: 20 }}>
                    <CellKey>FIL Balance</CellKey>
                    <CellValue>
                        {filecoinBalance ? ordinaryFormat(filecoinBalance) : 0}{' '}
                        FIL
                    </CellValue>
                </Cell>
                <Cell>
                    <CellKey>ETH Collateral</CellKey>
                    {account ? (
                        <CellValue>
                            {colBook.collateral !== null
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
            <Button onClick={() => alert('display the collateral modal')}>
                Manage Collateral
            </Button>
        </BalanceContainer>
    );
};

const BalanceContainer = styled.div`
    display: grid;
    margin-bottom: 15px;
`;
