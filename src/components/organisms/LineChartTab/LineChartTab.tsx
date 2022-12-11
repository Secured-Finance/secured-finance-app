import { useDispatch, useSelector } from 'react-redux';
import { Option } from 'src/components/atoms';
import { getData, LineChart } from 'src/components/molecules';
import { OrderSide, RateType, useRates } from 'src/hooks';
import { setMaturity } from 'src/store/advancedLendingForm';
import { RootState } from 'src/store/types';

export const LineChartTab = ({
    maturitiesOptionList,
}: {
    maturitiesOptionList: Option[];
}) => {
    const dispatch = useDispatch();
    const { currency, side, maturity } = useSelector(
        (state: RootState) => state.advancedLendingForm
    );

    const lendingContracts = useSelector(
        (state: RootState) => state.availableContracts.lendingMarkets[currency]
    );

    const rates = useRates(
        currency,
        side === OrderSide.Borrow ? RateType.Borrow : RateType.Lend
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
