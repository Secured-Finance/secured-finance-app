import { Side } from '@secured-finance/sf-client/dist/secured-finance-client';
import { useDispatch, useSelector } from 'react-redux';
import { getData, LineChart } from 'src/components/molecules';
import {
    selectMarketDashboardForm,
    setMaturity,
} from 'src/store/marketDashboardForm';
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
        selectMarketDashboardForm(state.marketDashboardForm)
    );

    const data = getData(
        rates,
        side === Side.BORROW ? 'Borrow' : 'Lend',
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
