import { OrderSide } from '@secured-finance/sf-client';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { LineChart, getData } from 'src/components/molecules';
import {
    selectLandingOrderForm,
    setMaturity,
} from 'src/store/landingOrderForm';
import { RootState } from 'src/store/types';
import { Rate } from 'src/utils';
import { Maturity } from 'src/utils/entities';

export const LineChartTab = ({
    rates,
    maturityList,
    itayoseMarketIndexSet,
}: {
    rates: Rate[];
    maturityList: MaturityListItem[];
    itayoseMarketIndexSet: Set<number>;
}) => {
    const dispatch = useDispatch();
    const router = useRouter();

    const { side, maturity } = useSelector((state: RootState) =>
        selectLandingOrderForm(state.landingOrderForm)
    );

    const data = getData(
        rates,
        side === OrderSide.BORROW ? 'Borrow' : 'Lend',
        maturityList.map(item => item.label),
        itayoseMarketIndexSet
    );

    return (
        <div className='h-full w-full'>
            {rates && (
                <LineChart
                    type='line'
                    data={data}
                    maturityList={maturityList}
                    handleChartClick={(maturity, isPreOrderPeriod) => {
                        dispatch(setMaturity(maturity));
                        if (isPreOrderPeriod) {
                            router.push('/itayose');
                        }
                    }}
                    maturity={new Maturity(maturity)}
                ></LineChart>
            )}
        </div>
    );
};

export type MaturityListItem = {
    label: string;
    maturity: number;
    isPreOrderPeriod: boolean;
};
