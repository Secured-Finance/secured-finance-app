import { formatDate } from '@secured-finance/sf-core';
import { useOrderHistory } from '@secured-finance/sf-graph-client/dist/hooks/useOrderHistory';
import { BigNumber } from 'ethers';
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    AdvancedLendingTopBar,
    HorizontalTab,
    Tab,
} from 'src/components/molecules';
import {
    AdvancedLendingOrderCard,
    LineChartTab,
    OpenOrderTable,
    OrderWidget,
} from 'src/components/organisms';
import { CollateralBook, OrderType, useGraphClientHook } from 'src/hooks';
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
import { CurrencySymbol, getCurrencyMapAsOptions, Rate } from 'src/utils';
import { LoanValue, Maturity } from 'src/utils/entities';
import { useWallet } from 'use-wallet';

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
    const { currency, maturity, orderType } = useSelector((state: RootState) =>
        selectLandingOrderForm(state.landingOrderForm)
    );
    const { account } = useWallet();

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
    const oderHistory = useGraphClientHook(
        account ?? '',
        useOrderHistory,
        'orders'
    );

    const selectedAsset = useMemo(() => {
        return assetList.find(option => option.value === currency);
    }, [currency, assetList]);

    const handleCurrencyChange = useCallback(
        (v: CurrencySymbol) => {
            if (v === currency) return;
            dispatch(setCurrency(v));
            dispatch(setAmount(BigNumber.from(0)));
        },
        [currency, dispatch]
    );

    return (
        <div className='flex flex-col gap-5'>
            <AdvancedLendingTopBar
                selectedAsset={selectedAsset}
                assetList={assetList}
                options={maturitiesOptionList.map(o => ({
                    label: o.label,
                    value: o.value.toString(),
                }))}
                selected={{
                    label: selectedTerm.label,
                    value: selectedTerm.value.toString(),
                }}
                onAssetChange={v => {
                    handleCurrencyChange(v);
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
                    <div className='w-full'>
                        <Tab
                            tabDataArray={[
                                { text: 'Yield Curve' },
                                { text: 'Price History', disabled: true },
                            ]}
                        >
                            <LineChartTab
                                maturitiesOptionList={maturitiesOptionList}
                                rates={rates}
                            />
                            <div />
                        </Tab>
                    </div>
                    <HorizontalTab
                        tabTitles={[
                            'Order Book',
                            'Market Trades',
                            'My Orders',
                            'My Trades',
                        ]}
                    >
                        <OrderWidget
                            buyOrders={orderBook.borrowOrderbook}
                            sellOrders={orderBook.lendOrderbook}
                            currency={currency}
                        />
                        <></>
                        <OpenOrderTable data={oderHistory} />
                    </HorizontalTab>
                </div>
            </div>
        </div>
    );
};
