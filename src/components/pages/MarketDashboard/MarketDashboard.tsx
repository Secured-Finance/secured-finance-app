import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DropdownSelector } from 'src/components/atoms';
import { MarketDashboardTopBar } from 'src/components/molecules';
import { OrderWidget } from 'src/components/organisms/OrderWidget';
import { useOrderbook } from 'src/hooks/useOrderbook';
import { setMaturity } from 'src/store/landingOrderForm';
import { setCurrency } from 'src/store/marketDashboardForm';
import { RootState } from 'src/store/types';
import { CurrencySymbol, formatDate, getCurrencyMapAsOptions } from 'src/utils';

export const MarketDashboard = () => {
    const { currency } = useSelector(
        (state: RootState) => state.marketDashboardForm
    );
    const lendingContracts = useSelector(
        (state: RootState) => state.availableContracts.lendingMarkets[currency]
    );

    const optionList = Object.entries(lendingContracts).map(o => ({
        label: o[0],
        value: o[1],
    }));

    const assetList = useMemo(() => getCurrencyMapAsOptions(), []);
    const dispatch = useDispatch();
    const orderBook = useOrderbook(currency, Number(optionList[0].value), 10);

    return (
        <div className='mx-40 mt-7 flex flex-col gap-5' data-cy='exchange-page'>
            <div className='mb-5'>
                <DropdownSelector
                    optionList={assetList}
                    selected={assetList[0]}
                    variant='roundedExpandButton'
                    onChange={(v: CurrencySymbol) => dispatch(setCurrency(v))}
                />
            </div>
            <MarketDashboardTopBar
                asset={currency}
                options={optionList}
                selected={optionList[0]}
                onTermChange={v => dispatch(setMaturity(v))}
                transformLabel={v => {
                    const ts = optionList.find(o => o.label === v)?.value;
                    return ts ? formatDate(Number(ts)) : v;
                }}
            />
            <div className='flex flex-row gap-6'>
                <OrderWidget
                    buyOrders={orderBook.borrowOrderbook}
                    sellOrders={orderBook.lendOrderbook}
                    currency={currency}
                />
            </div>
        </div>
    );
};
