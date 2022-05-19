import BigNumber from 'bignumber.js/bignumber';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { connect, useDispatch, useSelector } from 'react-redux';
import { Button } from 'src/components/new/Button';
import { Dropdown } from 'src/components/new/Dropdown';
import { FieldValue } from 'src/components/new/FieldValue';
import { Input } from 'src/components/new/Input';
import { useEthereumUsd, useFilUsd } from 'src/hooks/useAssetPrices';
import { usePlaceOrder } from 'src/hooks/usePlaceOrder';
import { getUSDCPrice } from 'src/store/assetPrices/selectors';
import {
    updateBorrowAmount,
    updateBorrowRate,
    updateLendAmount,
    updateLendRate,
    updateMainCurrency,
    updateMainTerms,
} from 'src/store/lending';
import { LendingStore } from 'src/store/lending/types';
import { RootState } from 'src/store/types';
import {
    getEthUSDBalance,
    getFilUSDBalance,
} from 'src/store/wallets/selectors';
import {
    currencyListDropdown,
    percentFormat,
    termList,
    usdFormat,
} from 'src/utils';
import { getCurrencyBy } from 'src/utils/currencyList';
import { daysInYear } from '../constants';
import BorrowCollateralManagement from './BorrowCollateralManagement';
import cm from './LendBorrowTable.module.scss';

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
    const amount = useMemo(
        () => new BigNumber(isBorrow ? borrowAmount : lendAmount),
        [borrowAmount, isBorrow, lendAmount]
    );
    const rate = isBorrow ? borrowRate : lendRate;
    const ethPrice = useEthereumUsd().price;
    const filPrice = useFilUsd().price;
    const usdcPrice = useSelector(getUSDCPrice);

    const USDBalanceMap = {
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
        dispatch(
            updateMainCurrency(
                getCurrencyBy('shortName', e.currentTarget.value)
            )
        );

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
    }, [amount, selectedCcy, filPrice, ethPrice, usdcPrice]);

    const handleAmountChange = useCallback(
        (e: React.FormEvent<HTMLInputElement>) => {
            const action = isBorrow ? updateBorrowAmount : updateLendAmount;
            dispatch(action(e.currentTarget.valueAsNumber));
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
    }, [termsIndex, USDAmount, rate]);

    const { onPlaceOrder: onPlaceLend } = usePlaceOrder(
        selectedCcy,
        selectedTerms,
        0,
        lendAmount,
        lendRate
    );
    const { onPlaceOrder: onPlaceBorrow } = usePlaceOrder(
        selectedCcy,
        selectedTerms,
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
            console.error(e);
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
                        Balance:{' '}
                        {usdFormat(
                            USDBalanceMap[
                                selectedCcy as keyof typeof USDBalanceMap
                            ]
                        )}
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
                        options={termList}
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

            <Button
                onClick={handleLendDeal}
                disabled={isButtonDisabled}
                style={{ marginTop: '32px' }}
            >
                {tabName}
            </Button>
        </>
    );
};

const mapStateToProps = (state: RootState) => state.lending;

export default connect(mapStateToProps)(LendBorrowTable);
