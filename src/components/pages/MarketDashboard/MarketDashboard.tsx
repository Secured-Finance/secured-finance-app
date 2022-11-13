import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { DropdownSelector } from 'src/components/atoms';
import { MarketDashboardTopBar } from 'src/components/molecules';
import { MarketDashboardOrderCard } from 'src/components/organisms/MarketDashboardOrderCard';
import { MarketOrganism } from 'src/components/organisms/MarketOrganism';
import {
    OrderSide,
    OrderType,
    RateType,
    useCollateralBook,
    useRates,
} from 'src/hooks';
import {
    setCurrency,
    setMaturity,
    setRate,
} from 'src/store/marketDashboardForm';
import { RootState } from 'src/store/types';
import {
    CurrencySymbol,
    formatDate,
    getCurrencyMapAsOptions,
    Rate,
} from 'src/utils';
import { useWallet } from 'use-wallet';

export const MarketDashboard = () => {
    const { account } = useWallet();
    const { currency, maturity, side, orderType } = useSelector(
        (state: RootState) => state.marketDashboardForm
    );
    const lendingContracts = useSelector(
        (state: RootState) => state.availableContracts.lendingMarkets[currency]
    );

    const optionList = Object.entries(lendingContracts).map(o => ({
        label: o[0],
        value: o[1],
    }));

    const collateralBook = useCollateralBook(account);

    const assetList = useMemo(() => getCurrencyMapAsOptions(), []);
    const dispatch = useDispatch();

    const selectedTerm = useMemo(() => {
        return (
            optionList.find(option => option.value === maturity) ||
            optionList[0]
        );
    }, [maturity, optionList]);

    const rates = useRates(
        currency,
        side === OrderSide.Borrow ? RateType.Borrow : RateType.Lend
    );

    const marketRate = useMemo(() => {
        if (!rates) {
            return new Rate(0);
        }

        const rate = rates[Object.values(lendingContracts).indexOf(maturity)];
        if (!rate) {
            return new Rate(0);
        }

        return rate;
    }, [rates, lendingContracts, maturity]);

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
                selected={selectedTerm}
                onTermChange={v => {
                    dispatch(setMaturity(v));
                    if (orderType === OrderType.MARKET) {
                        dispatch(setRate(marketRate.toNumber()));
                    }
                }}
                transformLabel={v => {
                    const ts = optionList.find(o => o.label === v)?.value;
                    return ts ? formatDate(Number(ts)) : v;
                }}
            />
            <div className='flex flex-row gap-6'>
                <MarketDashboardOrderCard collateralBook={collateralBook} />
                <MarketOrganism maturitiesOptionList={optionList} />
            </div>
        </div>
    );
};
