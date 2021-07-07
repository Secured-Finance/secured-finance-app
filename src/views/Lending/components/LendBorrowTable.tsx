import cm from './PlaceOrder.module.scss';
import { Dropdown } from 'src/components/new/Dropdown';
import { Input } from 'src/components/new/Input';
import { FieldValue } from 'src/components/new/FieldValue';
import { Button } from 'src/components/new/Button';
import React, { useCallback, useMemo } from 'react';
import {
    updateLendAmount,
    updateMainCurrency,
    updateMainTerms,
    updateBorrowAmount,
    updateMainCollateralCurrency,
    updateCollateralAmount,
} from 'src/store/lending';
import {
    currencyListDropdown,
    collateralListDropdown,
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
import { VerifiedIcon } from 'src/components/new/icons';

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
    collateralCcy,
    collateralAmount,
}) => {
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

    const handleCollateralCurrencyChange = (
        e: React.SyntheticEvent<HTMLSelectElement>
    ) => dispatch(updateMainCollateralCurrency(e.currentTarget.value));

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
        [dispatch]
    );

    const handleCollateralChange = useCallback(
        (e: React.FormEvent<HTMLInputElement>) => {
            dispatch(updateCollateralAmount(e.currentTarget.value));
        },
        [dispatch]
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

            {isBorrow && (
                <>
                    <div className={cm.table}>
                        <span className={cm.tableTitle}>
                            <span>Collateral Currency</span>
                            <span className={cm.tableTitleComment}>
                                MIN 150%
                            </span>
                        </span>

                        <span className={cm.collateralRow}>
                            <Dropdown
                                options={collateralListDropdown}
                                value={collateralCcy}
                                onChange={handleCollateralCurrencyChange}
                                noBorder
                            />
                            <span className={cm.divider} />

                            <Input
                                value={collateralAmount}
                                onChange={handleCollateralChange}
                                noBorder
                                alignRight
                            />
                        </span>
                    </div>
                    <div className={cm.collateralCoverage}>
                        <FieldValue
                            field={'Collateral Coverage'}
                            value={'150%'}
                            accent={'purple'}
                            icon={<VerifiedIcon fill={'#666CF380'} size={20} />}
                            large
                        />
                    </div>
                </>
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

            <Button>{tabName}</Button>
        </>
    );
};

const mapStateToProps = (state: RootState) => state.lending;

export default connect(mapStateToProps)(LendBorrowTable);
