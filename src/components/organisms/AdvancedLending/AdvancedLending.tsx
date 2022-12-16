import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DropdownSelector } from 'src/components/atoms';
import { AdvancedLendingTopBar } from 'src/components/molecules';
import {
    AdvancedLendingOrderCard,
    AdvancedLendingOrganism,
    OrderWidget,
} from 'src/components/organisms';
import { CollateralBook, OrderType } from 'src/hooks';
import { useOrderbook } from 'src/hooks/useOrderbook';
import {
    selectLandingOrderForm,
    setAmount,
    setCurrency,
    setMaturity,
    setUnitPrice,
} from 'src/store/landingOrderForm';
import { RootState } from 'src/store/types';
import { MaturityOptionList } from 'src/types';
import {
    CurrencySymbol,
    formatDate,
    getCurrencyMapAsOptions,
    Rate,
} from 'src/utils';
import { LoanValue, Maturity } from 'src/utils/entities';

export const AdvancedLending = ({
    collateralBook,
    loanValue,
    maturitiesOptionList,
    rates,
}: {
    collateralBook: CollateralBook;
    loanValue: LoanValue;
    maturitiesOptionList: MaturityOptionList;
    rates: Rate[];
}) => {
    const { currency, maturity, orderType, amount } = useSelector(
        (state: RootState) => selectLandingOrderForm(state.landingOrderForm)
    );

    const assetList = useMemo(() => getCurrencyMapAsOptions(), []);
    const dispatch = useDispatch();

    const selectedTerm = useMemo(() => {
        return (
            maturitiesOptionList.find(option =>
                option.value.equals(maturity)
            ) || maturitiesOptionList[0]
        );
    }, [maturity, maturitiesOptionList]);

    const orderBook = useOrderbook(currency, selectedTerm.value, 10);

    const selectedAsset = useMemo(() => {
        return assetList.find(option => option.value === currency);
    }, [currency, assetList]);

    const handleTermChange = useCallback(
        (v: CurrencySymbol) => {
            dispatch(setCurrency(v));
            dispatch(setAmount(amount));
        },
        [amount, dispatch]
    );

    return (
        <div className='flex flex-col gap-5'>
            <div className='mb-5'>
                <DropdownSelector
                    optionList={assetList}
                    selected={selectedAsset}
                    variant='roundedExpandButton'
                    onChange={handleTermChange}
                />
            </div>
            <AdvancedLendingTopBar
                asset={currency}
                options={maturitiesOptionList.map(o => ({
                    label: o.label,
                    value: o.value.toString(),
                }))}
                selected={{
                    label: selectedTerm.label,
                    value: selectedTerm.value.toString(),
                }}
                onTermChange={v => {
                    dispatch(setMaturity(new Maturity(v)));
                    if (orderType === OrderType.MARKET) {
                        dispatch(setUnitPrice(loanValue.price));
                    }
                }}
                transformLabel={v => {
                    const ts = maturitiesOptionList.find(o =>
                        o.value.equals(new Maturity(v))
                    )?.value;
                    return ts ? formatDate(ts.toNumber()) : v;
                }}
            />
            <div className='flex flex-row gap-6'>
                <AdvancedLendingOrderCard collateralBook={collateralBook} />
                <div className='flex flex-grow flex-col gap-6'>
                    <AdvancedLendingOrganism
                        maturitiesOptionList={maturitiesOptionList}
                        rates={rates}
                    />
                    <OrderWidget
                        buyOrders={orderBook.borrowOrderbook}
                        sellOrders={orderBook.lendOrderbook}
                        currency={currency}
                    />
                </div>
            </div>
        </div>
    );
};
