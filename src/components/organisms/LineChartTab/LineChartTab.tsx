import { OrderSide } from '@secured-finance/sf-client';
import { useMemo } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { LineChart, getData } from 'src/components/molecules';
import { RateType, useLoanValues, useMaturityOptions } from 'src/hooks';
import {
    selectLandingOrderForm,
    setMaturity,
} from 'src/store/landingOrderForm';
import { RootState } from 'src/store/types';
import { Maturity } from 'src/utils/entities';

export const LineChartTab = () => {
    const dispatch = useDispatch();
    const { side, maturity, currency } = useSelector((state: RootState) =>
        selectLandingOrderForm(state.landingOrderForm)
    );

    const lendingContracts = useSelector(
        (state: RootState) => state.availableContracts.lendingMarkets[currency],
        shallowEqual
    );

    const maturitiesOptionList = useMaturityOptions(lendingContracts);

    const maturityList = Object.values(lendingContracts).map(obj => obj.name);

    const unitPrices = useLoanValues(
        lendingContracts,
        side === OrderSide.BORROW ? RateType.Borrow : RateType.Lend
    );

    const itayoseMarketIndex = useMemo(
        () =>
            Object.values(lendingContracts).findIndex(
                market => market.isItayosePeriod && !market.isPreOrderPeriod
            ),
        [lendingContracts]
    );

    const rates = Array.from(unitPrices.values()).map(v => v.apr);

    const data = getData(
        rates,
        side === OrderSide.BORROW ? 'Borrow' : 'Lend',
        maturityList,
        itayoseMarketIndex
    );

    return (
        <div className='h-[410px] w-full px-6 py-4'>
            {rates && (
                <LineChart
                    type='line'
                    data={data}
                    maturitiesOptionList={maturitiesOptionList}
                    handleChartClick={maturity =>
                        dispatch(setMaturity(maturity.toNumber()))
                    }
                    maturity={new Maturity(maturity)}
                ></LineChart>
            )}
        </div>
    );
};
