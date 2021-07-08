import cm from './LendBorrowTable.module.scss';
import {
    calculatePercents,
    MIN_COVERAGE,
    getSmartFormattedNumber,
} from '../constants';
import { Dropdown } from 'src/components/new/Dropdown';
import { collateralListDropdown } from 'src/utils';
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

interface IBorrowCollateralManagement extends LendingStore {
    USDAmount: number;
}

const BorrowCollateralManagement: React.FC<IBorrowCollateralManagement> = ({
    collateralCcy,
    collateralAmount,
    USDAmount,
}) => {
    const dispatch = useDispatch();
    const filPrice = useSelector(getFilPrice);
    const ethPrice = useSelector(getEthPrice);
    const usdcPrice = useSelector(getUSDCPrice);

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
        switch (collateralCcy) {
            case 'FIL':
                return collateralAmount * filPrice;
            case 'ETH':
                return collateralAmount * ethPrice;
            case 'USDC':
                return collateralAmount * usdcPrice;
            default:
                return 0;
        }
    }, [collateralAmount, collateralCcy]);

    const tokenCollateral = (amount: number) => {
        switch (collateralCcy) {
            case 'FIL':
                return amount / filPrice;
            case 'ETH':
                return amount / ethPrice;
            case 'USDC':
                return amount / usdcPrice;
            default:
                return 0;
        }
    };

    const collateralCoverage = calculatePercents(USDCollateral, USDAmount);
    const collateralPercentageDifference = MIN_COVERAGE - +collateralCoverage;
    const inadequateCollateral = collateralPercentageDifference > 0;

    const addCollateral = () => {
        const amountToAdd = (USDAmount / 100) * collateralPercentageDifference;
        const sufficientUSDCollateralAmount = +USDCollateral + +amountToAdd;
        console.log({
            USDCollateral,
            amountToAdd,
            sufficientUSDCollateralAmount,
            ethPrice,
        });
        const sufficientCollateral = getSmartFormattedNumber(
            tokenCollateral(sufficientUSDCollateralAmount)
        );
        console.log(USDCollateral, amountToAdd);
        dispatch(updateCollateralAmount(sufficientCollateral));
    };

    return (
        <>
            <div className={cm.table}>
                <span className={cm.tableTitle}>
                    <span>Collateral Currency</span>
                    <span className={cm.tableTitleComment}>
                        MIN {MIN_COVERAGE}%
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
                        type={'number'}
                        noBorder
                        alignRight
                    />
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
                {inadequateCollateral && (
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
