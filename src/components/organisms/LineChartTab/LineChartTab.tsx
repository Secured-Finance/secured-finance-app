import { useDispatch, useSelector } from 'react-redux';
import { getData, LineChart } from 'src/components/molecules';
import { OrderSide, RateType, useRates } from 'src/hooks';
import {
    selectMarketDashboardForm,
    setMaturity,
} from 'src/store/marketDashboardForm';
import { RootState } from 'src/store/types';
import { MaturityOptionList } from 'src/types';

export const LineChartTab = ({
    maturitiesOptionList,
}: {
    maturitiesOptionList: MaturityOptionList;
}) => {
    const dispatch = useDispatch();
    const { currency, side, maturity } = useSelector((state: RootState) =>
        selectMarketDashboardForm(state.marketDashboardForm)
    );

    const lendingContracts = useSelector(
        (state: RootState) => state.availableContracts.lendingMarkets[currency]
    );

    const rates = useRates(
        currency,
        side === OrderSide.Borrow ? RateType.Borrow : RateType.Lend,
        maturity
    );

    const data = getData(
        rates,
        side === OrderSide.Borrow ? 'Borrow' : 'Lend',
        Object.keys(lendingContracts)
    );

    return (
        <div className='h-[410px] w-full px-6 py-4'>
            {rates && (
                <LineChart
                    type='line'
                    data={data}
                    maturitiesOptionList={maturitiesOptionList}
                    handleChartClick={maturity =>
                        dispatch(setMaturity(maturity))
                    }
                    maturity={maturity}
                ></LineChart>
            )}
        </div>
    );
};
