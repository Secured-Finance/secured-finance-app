import cm from './LendBorrowTable.module.scss';
import { calculatePercents, MIN_COVERAGE } from '../constants';
import { Dropdown } from 'src/components/new/Dropdown';
import { collateralListDropdown, usdFormat } from 'src/utils';
import { Input } from 'src/components/new/Input';
import { FieldValue } from 'src/components/new/FieldValue';
import React, { useCallback, useMemo } from 'react';
import { ChipButton } from 'src/components/new/Chip/ChipButton';
import { VerifiedIcon } from 'src/components/new/icons';
import { RootState } from 'src/store/types';
import { connect, useDispatch, useSelector } from 'react-redux';
import {
    LendingStore,
    updateCollateralAmount,
    updateMainCollateralCurrency,
} from 'src/store/lending';
import {
    getEthPrice,
    getFilPrice,
    getUSDCPrice,
} from 'src/store/assetPrices/selectors';
import BigNumber from 'bignumber.js';
import { getEthBalance } from 'src/store/wallets/selectors';
import cx from 'classnames';

interface IBorrowCollateralManagement extends LendingStore {
    USDAmount: BigNumber;
    setCollateralInadequate: (bool: boolean) => void;
}

const BorrowCollateralManagement: React.FC<IBorrowCollateralManagement> = ({
    collateralCcy,
    collateralAmount,
    USDAmount,
    setCollateralInadequate,
}) => {
    const dispatch = useDispatch();
    const filPrice = useSelector(getFilPrice);
    const ethPrice = useSelector(getEthPrice);
    const usdcPrice = useSelector(getUSDCPrice);
    const priceMap: any = {
        FIL: filPrice,
        ETH: ethPrice,
        USDC: usdcPrice,
    };

    const balanceMap: any = {
        ETH: useSelector(getEthBalance),
        USDC: 0,
    };

    const handleCollateralCurrencyChange = (
        e: React.SyntheticEvent<HTMLSelectElement>
    ) => dispatch(updateMainCollateralCurrency(e.currentTarget.value));

    const handleCollateralChange = useCallback(
        (e: React.FormEvent<HTMLInputElement>) => {
            dispatch(updateCollateralAmount(e.currentTarget.value));
        },
        [dispatch]
    );

    const USDCollateral = useMemo(() => {
        if (!collateralAmount) return new BigNumber(0);

        return new BigNumber(collateralAmount).multipliedBy(
            priceMap[collateralCcy]
        );
    }, [collateralAmount, collateralCcy]);

    const getTokenCollateral = (amount: BigNumber) => {
        return amount.dividedBy(priceMap[collateralCcy]);
    };

    const collateralCoverage = calculatePercents(USDCollateral, USDAmount);
    const collateralPercentageDifference = MIN_COVERAGE - +collateralCoverage;
    const inadequateCollateral = collateralPercentageDifference > 0;

    const addCollateral = () => {
        const appropriateUSDAmount = USDAmount.multipliedBy(1.5);
        const sufficientCollateral = getTokenCollateral(appropriateUSDAmount);
        dispatch(updateCollateralAmount(sufficientCollateral));
    };

    React.useEffect(() => {
        setCollateralInadequate(inadequateCollateral);
    }, [inadequateCollateral]);

    return (
        <>
            <div className={cm.table}>
                <span className={cm.tableTitle}>
                    <span>Collateral Currency</span>
                    <span className={cm.tableTitleComment}>
                        MIN {MIN_COVERAGE}%
                    </span>
                </span>

                <span className={cm.inputsWithBorder}>
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
                        type={'number'}
                        noBorder
                        alignRight
                    />
                </span>
                <span className={cm.bottomRow}>
                    <span>Balance: {balanceMap[collateralCcy]}</span>
                    <span
                        className={cx(
                            inadequateCollateral && cm.inadequateCollateral,
                            cm.USDValue
                        )}
                    >
                        ~ {usdFormat(USDCollateral.toNumber())}
                    </span>
                </span>
            </div>
            <div className={cm.collateralCoverage}>
                <FieldValue
                    field={'Collateral Coverage'}
                    value={`${collateralCoverage}%`}
                    accent={inadequateCollateral ? 'red' : 'purple'}
                    icon={
                        inadequateCollateral ? null : (
                            <VerifiedIcon fill={'#666CF380'} size={20} />
                        )
                    }
                    large
                />
                {inadequateCollateral && USDAmount.isGreaterThan(0) && (
                    <span className={cm.collateralManagement}>
                        <span className={cm.collateralCoverageComment}>
                            You need {MIN_COVERAGE}%. Please, click below on tag
                            to add some percents of coverage.
                        </span>
                        <ChipButton
                            onClick={addCollateral}
                            style={{ alignSelf: 'flex-start' }}
                        >
                            +{collateralPercentageDifference}%
                        </ChipButton>
                    </span>
                )}
            </div>
        </>
    );
};

const mapStateToProps = (state: RootState) => state.lending;

export default connect(mapStateToProps)(BorrowCollateralManagement);
