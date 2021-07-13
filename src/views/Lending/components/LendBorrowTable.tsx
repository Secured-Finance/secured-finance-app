import cm from './LendBorrowTable.module.scss';
import { Dropdown } from 'src/components/new/Dropdown';
import { Input } from 'src/components/new/Input';
import { FieldValue } from 'src/components/new/FieldValue';
import { Button } from 'src/components/new/Button';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
    updateLendAmount,
    updateMainCurrency,
    updateMainTerms,
    updateBorrowAmount,
    updateLendRate,
    updateBorrowRate,
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
import { getUSDCPrice } from 'src/store/assetPrices/selectors';
import {
    getEthUSDBalance,
    getFilUSDBalance,
} from 'src/store/wallets/selectors';
import { daysInYear } from '../constants';
import { usePlaceOrder } from 'src/hooks/usePlaceOrder';
import BorrowCollateralManagement from './BorrowCollateralManagement';
import BigNumber from 'bignumber.js/bignumber';
import { useEthereumUsd, useFilUsd } from 'src/hooks/useAssetPrices';

interface ILendBorrowTable extends LendingStore {
    selectedTab: string;
    lendingRates: Array<number>;
    borrowRates: Array<number>;
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
    lendingRates,
    borrowRates,
}) => {
    const [pendingTx, setPendingTx] = useState(false);
    const [isCollateralInadequate, setCollateralInadequate] = useState(false);
    const dispatch = useDispatch();
    const tabName = selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1);

    const ethUSDBalance = useSelector(getEthUSDBalance);
    const filUSDBalance = useSelector(getFilUSDBalance);
    const isBorrow = selectedTab === 'borrow';
    const amount = new BigNumber(isBorrow ? borrowAmount : lendAmount);
    const rate = isBorrow ? borrowRate : lendRate;
    const ethPrice = useEthereumUsd().price;
    const filPrice = useFilUsd().price;
    const usdcPrice = useSelector(getUSDCPrice);

    const USDBalanceMap: any = {
        ETH: ethUSDBalance,
        FIL: filUSDBalance,
        USDC: 0,
    };

    useEffect(() => {
        const rates = isBorrow ? borrowRates : lendingRates;
        if (rates.length > 0) {
            const action = isBorrow ? updateBorrowRate : updateLendRate;
            dispatch(action(rates[termsIndex]));
        }
    }, [
        dispatch,
        currencyIndex,
        termsIndex,
        selectedTab,
        borrowRates,
        lendingRates,
        isBorrow,
    ]);

    const handleCurrencyChange = (e: React.SyntheticEvent<HTMLSelectElement>) =>
        dispatch(updateMainCurrency(e.currentTarget.value));

    const USDAmount: BigNumber = useMemo(() => {
        if (amount.isNaN()) return new BigNumber(0);
        switch (selectedCcy) {
            case 'FIL':
                return amount.multipliedBy(filPrice);
            case 'ETH':
                return amount.multipliedBy(ethPrice);
            case 'USDC':
                return amount.multipliedBy(usdcPrice);
            default:
                return new BigNumber(0);
        }
    }, [borrowAmount, lendAmount, selectedCcy, isBorrow]);

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

        return USDAmount.multipliedBy(p).toNumber();
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

    const isButtonDisabled =
        pendingTx ||
        (isBorrow && (borrowAmount <= 0 || isCollateralInadequate)) ||
        amount.isNaN() ||
        amount.isEqualTo(0) ||
        amount.isLessThan(0);

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
                        value={amount.toNumber()}
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
                        ~ {usdFormat(USDAmount.toNumber())}
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

            {isBorrow && (
                <BorrowCollateralManagement
                    USDAmount={USDAmount}
                    setCollateralInadequate={setCollateralInadequate}
                />
            )}

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

            <Button onClick={handleLendDeal} disabled={isButtonDisabled}>
                {tabName}
            </Button>
        </>
    );
};

const mapStateToProps = (state: RootState) => state.lending;

export default connect(mapStateToProps)(LendBorrowTable);
