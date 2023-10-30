import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { LineChart, getData, options } from 'src/components/molecules';
import { useIsGlobalItayose } from 'src/hooks';
import {
    selectLandingOrderForm,
    setMaturity,
} from 'src/store/landingOrderForm';
import { RootState } from 'src/store/types';
import { Rate, currencyMap } from 'src/utils';
import { Maturity } from 'src/utils/entities';

export const LineChartTab = ({
    rates,
    maturityList,
    itayoseMarketIndexSet,
    followLinks = true,
}: {
    rates: Rate[];
    maturityList: MaturityListItem[];
    itayoseMarketIndexSet: Set<number>;
    followLinks?: boolean;
}) => {
    const dispatch = useDispatch();
    const router = useRouter();

    const isGlobalItayose = useIsGlobalItayose();

    const { currency, maturity } = useSelector((state: RootState) =>
        selectLandingOrderForm(state.landingOrderForm)
    );

    const chartOptions = {
        ...options,
        y: {
            position: 'right',
        },
    };

    const itayoseBorderColor = !isGlobalItayose
        ? '#B9BDEA'
        : currencyMap[currency].chartColor;

    const data = getData(
        rates,
        'Market price',
        maturityList.map(item => item.label),
        itayoseMarketIndexSet,
        itayoseBorderColor
    );

    return (
        <div className='h-full w-full'>
            {rates && (
                <LineChart
                    type='line'
                    data={data}
                    maturityList={maturityList}
                    options={chartOptions}
                    handleChartClick={maturityIndex => {
                        const { maturity, isPreOrderPeriod } =
                            maturityList[maturityIndex];
                        dispatch(setMaturity(maturity));

                        if (isPreOrderPeriod) {
                            router.push('/itayose');
                        } else if (followLinks) {
                            router.push('/advanced');
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
