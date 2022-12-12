import { BigNumber } from 'ethers';
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DropdownSelector, Option } from 'src/components/atoms';
import { AdvancedLendingTopBar } from 'src/components/molecules';
import {
    AdvancedLendingOrderCard,
    AdvancedLendingOrganism,
    OrderWidget,
} from 'src/components/organisms';
import { CollateralBook, OrderType } from 'src/hooks';
import { useOrderbook } from 'src/hooks/useOrderbook';
import {
    setAmount,
    setCurrency,
    setMaturity,
    setRate,
} from 'src/store/landingOrderForm';
import { RootState } from 'src/store/types';
import {
    CurrencySymbol,
    formatDate,
    getCurrencyMapAsOptions,
    Rate,
} from 'src/utils';

export const AdvancedLending = ({
    collateralBook,
    marketRate,
    maturitiesOptionList,
}: {
    collateralBook: CollateralBook;
    marketRate: Rate;
    maturitiesOptionList: Option[];
}) => {
    const { currency, maturity, orderType } = useSelector(
        (state: RootState) => state.landingOrderForm
    );

    const assetList = useMemo(() => getCurrencyMapAsOptions(), []);
    const dispatch = useDispatch();
    const orderBook = useOrderbook(
        currency,
        Number(maturitiesOptionList[0].value),
        10
    );

    const selectedTerm = useMemo(() => {
        return (
            maturitiesOptionList.find(option => option.value === maturity) ||
            maturitiesOptionList[0]
        );
    }, [maturity, maturitiesOptionList]);

    const handleTermChange = useCallback(
        (v: CurrencySymbol) => {
            dispatch(setCurrency(v));
            dispatch(setAmount(BigNumber.from(0)));
        },
        [dispatch]
    );

    return (
        <div className='flex flex-col gap-5'>
            <div className='mb-5'>
                <DropdownSelector
                    optionList={assetList}
                    selected={assetList[0]}
                    variant='roundedExpandButton'
                    onChange={handleTermChange}
                />
            </div>
            <AdvancedLendingTopBar
                asset={currency}
                options={maturitiesOptionList}
                selected={selectedTerm}
                onTermChange={v => {
                    dispatch(setMaturity(v));
                    if (orderType === OrderType.MARKET) {
                        dispatch(setRate(marketRate.toNumber()));
                    }
                }}
                transformLabel={v => {
                    const ts = maturitiesOptionList.find(
                        o => o.label === v
                    )?.value;
                    return ts ? formatDate(Number(ts)) : v;
                }}
            />
            <div className='flex flex-row gap-6'>
                <AdvancedLendingOrderCard collateralBook={collateralBook} />
                <div className='flex flex-grow flex-col gap-6'>
                    <AdvancedLendingOrganism
                        maturitiesOptionList={maturitiesOptionList}
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
