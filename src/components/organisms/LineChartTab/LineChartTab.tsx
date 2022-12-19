import { OrderSide } from '@secured-finance/sf-client';
import { useDispatch, useSelector } from 'react-redux';
import { getData, LineChart } from 'src/components/molecules';
import {
    selectLandingOrderForm,
    setMaturity,
} from 'src/store/landingOrderForm';
import { RootState } from 'src/store/types';
import { MaturityOptionList } from 'src/types';
import { Rate } from 'src/utils';

export const LineChartTab = ({
    maturitiesOptionList,
    rates,
}: {
    maturitiesOptionList: MaturityOptionList;
    rates: Rate[];
}) => {
    const dispatch = useDispatch();
    const { side, maturity } = useSelector((state: RootState) =>
        selectLandingOrderForm(state.landingOrderForm)
    );

    const data = getData(
        rates,
        side === OrderSide.BORROW ? 'Borrow' : 'Lend',
        maturitiesOptionList.map(o => o.label)
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
