import cm from './LendBorrowTable.module.scss';
import { Dropdown } from 'src/components/new/Dropdown';
import { Input } from 'src/components/new/Input';
import { FieldValue } from 'src/components/new/FieldValue';
import { Button } from 'src/components/new/Button';
import React, { useCallback, useMemo, useState } from 'react';
import {
    updateLendAmount,
    updateMainCurrency,
    updateMainTerms,
    updateBorrowAmount,
} from 'src/store/lending';
import {
    currencyListDropdown,
    percentFormat,
    termsList,
    usdFormat,
} from 'src/utils';
import { connect, useDispatch, useSelector } from 'react-redux';
import { LendingStore } from 'src/store/lending/types';
import { RootState } from 'src/store/types';
import {
    getFilPrice,
    getEthPrice,
    getUSDCPrice,
} from 'src/store/assetPrices/selectors';
import {
    getEthUSDBalance,
    getFilUSDBalance,
} from 'src/store/wallets/selectors';
import { daysInYear } from '../constants';
import { usePlaceOrder } from 'src/hooks/usePlaceOrder';
import BorrowCollateralManagement from './BorrowCollateralManagement';

interface ILendBorrowTable extends LendingStore {
    selectedTab: string;
}

export const LendBorrowTable: React.FC<ILendBorrowTable> = ({
    selectedTab,
    selectedCcy,
    lendAmount,
    selectedTerms,
    lendRate,
    termsIndex,
    currencyIndex,
    borrowAmount,
    borrowRate,
}) => {
    const [pendingTx, setPendingTx] = useState(false);
    const dispatch = useDispatch();
    const tabName = selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1);
    const filPrice = useSelector(getFilPrice);
    const ethPrice = useSelector(getEthPrice);
    const usdcPrice = useSelector(getUSDCPrice);
    const isBorrow = selectedTab === 'borrow';
    const amount = isBorrow ? borrowAmount : lendAmount;
    const rate = isBorrow ? borrowRate : lendRate;

    const ethUSDBalance = useSelector(getEthUSDBalance);
    const filUSDBalance = useSelector(getFilUSDBalance);

    const USDBalanceMap: any = {
        ETH: ethUSDBalance,
        FIL: filUSDBalance,
        USDC: 0,
    };

    const handleCurrencyChange = (e: React.SyntheticEvent<HTMLSelectElement>) =>
        dispatch(updateMainCurrency(e.currentTarget.value));

    const USDAmount = useMemo(() => {
        switch (selectedCcy) {
            case 'FIL':
                return amount * filPrice;
            case 'ETH':
                return amount * ethPrice;
            case 'USDC':
                return amount * usdcPrice;
            default:
                return 0;
        }
    }, [borrowAmount, lendAmount, selectedCcy]);

    const handleAmountChange = useCallback(
        (e: React.FormEvent<HTMLInputElement>) => {
            const action = isBorrow ? updateBorrowAmount : updateLendAmount;
            dispatch(action(e.currentTarget.value));
        },
        [isBorrow, dispatch]
    );

    const handleTermsChange = (e: React.SyntheticEvent<HTMLSelectElement>) => {
        dispatch(updateMainTerms(e.currentTarget.value));
    };

    const getEstimatedReturns = useMemo(() => {
        const interest = rate / 10000;
        const p = interest * (daysInYear[termsIndex] / 360);

        return USDAmount * p;
    }, [
        termsIndex,
        currencyIndex,
        lendRate,
        lendAmount,
        borrowRate,
        borrowAmount,
    ]);

    const { onPlaceOrder: onPlaceLend } = usePlaceOrder(
        currencyIndex,
        termsIndex,
        0,
        lendAmount,
        lendRate
    );
    const { onPlaceOrder: onPlaceBorrow } = usePlaceOrder(
        currencyIndex,
        termsIndex,
        1,
        borrowAmount,
        borrowRate
    );
    const action = isBorrow ? onPlaceBorrow : onPlaceLend;

    const handleLendDeal = useCallback(async () => {
        try {
            setPendingTx(true);
            await action();
            setPendingTx(false);
        } catch (e) {
            console.log(e);
        }
    }, [action, setPendingTx]);

    return (
        <>
            <div className={cm.table}>
                <span className={cm.tableTitle}>Currency</span>
                <span className={cm.inputsWithBorder}>
                    <Dropdown
                        options={currencyListDropdown}
                        value={selectedCcy}
                        onChange={handleCurrencyChange}
                        noBorder
                    />
                    <span className={cm.divider} />
                    <Input
                        value={amount}
                        onChange={handleAmountChange}
                        type={'number'}
                        noBorder
                        alignRight
                    />
                </span>
                <span className={cm.bottomRow}>
                    <span>
                        Balance: {usdFormat(USDBalanceMap[selectedCcy])}
                    </span>
                    <span className={cm.USDValue}>
                        ~ {usdFormat(USDAmount)}
                    </span>
                </span>
            </div>

            <div className={cm.table}>
                <span className={cm.tableTitle}>
                    {isBorrow ? 'Borrow' : 'Loan'} Terms
                </span>
                <span className={cm.bottomRow}>
                    <Dropdown
                        options={termsList}
                        onChange={handleTermsChange}
                        value={selectedTerms}
                        label={'Fixed'}
                        noBorder
                    />
                    <FieldValue
                        field={'Rate (APY)'}
                        value={percentFormat(rate, 10000)}
                        large
                        alignRight
                    />
                </span>
            </div>

            {isBorrow && <BorrowCollateralManagement USDAmount={USDAmount} />}

            <div className={cm.feeAndReturnsRow}>
                {isBorrow ? (
                    <FieldValue
                        field={'Coupon Payment'}
                        value={'$0'}
                        accent={'red'}
                        large
                    />
                ) : (
                    <FieldValue
                        field={'Estimated Returns'}
                        value={usdFormat(getEstimatedReturns)}
                        accent={'green'}
                        large
                    />
                )}
                <FieldValue field={'Transaction Fee'} value={'$1.2'} large />
            </div>

            <Button onClick={handleLendDeal} disabled={pendingTx}>
                {tabName}
            </Button>
        </>
    );
};

const mapStateToProps = (state: RootState) => state.lending;

export default connect(mapStateToProps)(LendBorrowTable);
