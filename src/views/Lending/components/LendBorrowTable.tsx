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
}) => {
    const dispatch = useDispatch();
    const tabName = selectedTab.charAt(0).toUpperCase() + selectedTab.slice(1);
    const filPrice = useSelector(getFilPrice);
    const ethPrice = useSelector(getEthPrice);
    const usdcPrice = useSelector(getUSDCPrice);

    const ethUSDBalance = useSelector(getEthUSDBalance);
    const filUSDBalance = useSelector(getFilUSDBalance);

    const USDBalanceMap: any = {
        ETH: ethUSDBalance,
        FIL: filUSDBalance,
        USDC: 0,
    };

    const handleCurrencyChange = (currency: string) =>
        dispatch(updateMainCurrency(currency));

    const USDAmount = useMemo(() => {
        switch (selectedCcy) {
            case 'FIL':
                return lendAmount * filPrice;
            case 'ETH':
                return lendAmount * ethPrice;
            case 'USDC':
                return lendAmount * usdcPrice;
            default:
                return 0;
        }
    }, [lendAmount, selectedCcy]);

    const handleLendAmountChange = useCallback(
        (e: React.FormEvent<HTMLInputElement>) => {
            dispatch(updateLendAmount(e.currentTarget.value));
        },
        [dispatch]
    );

    const handleTermsChange = (e: React.SyntheticEvent<HTMLSelectElement>) => {
        dispatch(updateMainTerms(e.currentTarget.value));
    };

    const getEstimatedReturns = useMemo(() => {
        let interest = lendRate / 10000;
        let p = interest * (daysInYear[termsIndex] / 360);

        return USDAmount * p;
    }, [termsIndex, currencyIndex, lendRate, lendAmount]);

    return (
        <>
            <div className={cm.table}>
                <span className={cm.tableTitle}>Currency</span>
                <span className={cm.inputsWithBorder}>
                    <Dropdown
                        options={currencyListDropdown}
                        value={selectedCcy}
                        onChange={e =>
                            handleCurrencyChange(e.currentTarget.value)
                        }
                        noBorder
                    />
                    <span className={cm.divider} />
                    <Input
                        value={lendAmount}
                        onChange={handleLendAmountChange}
                        noBorder
                        alignRight
                    />
                </span>
                <span className={cm.subtitle}>
                    <span>
                        Balance: {usdFormat(USDBalanceMap[selectedCcy])}
                    </span>
                    <span className={cm.USDValue}>
                        ~ {usdFormat(USDAmount)}
                    </span>
                </span>
            </div>

            <div className={cm.table}>
                <span className={cm.tableTitle}>Loan Terms</span>
                <span className={cm.loanTermsRow}>
                    <Dropdown
                        options={termsList}
                        onChange={handleTermsChange}
                        value={selectedTerms}
                        label={'Fixed'}
                        noBorder
                    />
                    <FieldValue
                        field={'Rate (APY)'}
                        value={percentFormat(lendRate, 10000)}
                        large
                        alignRight
                    />
                </span>
            </div>

            <div className={cm.feeAndReturnsRow}>
                <FieldValue
                    field={'Estimated Returns'}
                    value={usdFormat(getEstimatedReturns)}
                    accent={'green'}
                    large
                />
                <FieldValue field={'Transaction Fee'} value={'$1.2'} large />
            </div>

            <Button>{tabName}</Button>
        </>
    );
};

const mapStateToProps = (state: RootState) => state.lending;

export default connect(mapStateToProps)(LendBorrowTable);
