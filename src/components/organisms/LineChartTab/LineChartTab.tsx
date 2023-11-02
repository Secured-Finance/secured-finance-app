import { ChartOptions, ChartTypeRegistry, TooltipItem } from 'chart.js';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';
import { LineChart, getData, options } from 'src/components/molecules';
import { useIsGlobalItayose } from 'src/hooks';
import {
    selectLandingOrderForm,
    setMaturity,
} from 'src/store/landingOrderForm';
import { RootState } from 'src/store/types';
import { ONE_PERCENT, Rate, currencyMap } from 'src/utils';
import { Maturity } from 'src/utils/entities';

export const LineChartTab = ({
    rates,
    maturityList,
    itayoseMarketIndexSet,
    followLinks = true,
    maximumRate,
    marketCloseToMaturityOriginalRate,
}: {
    rates: Rate[];
    maturityList: MaturityListItem[];
    itayoseMarketIndexSet: Set<number>;
    followLinks?: boolean;
    maximumRate: number;
    marketCloseToMaturityOriginalRate: number;
}) => {
    const dispatch = useDispatch();
    const router = useRouter();

    const isGlobalItayose = useIsGlobalItayose();

    const { currency, maturity } = useSelector((state: RootState) =>
        selectLandingOrderForm(state.landingOrderForm)
    );

    const chartOptions: ChartOptions<'line'> = {
        ...options,
        scales: {
            ...options.scales,
            y: {
                ...options.scales?.y,
                position: 'right',
                max:
                    marketCloseToMaturityOriginalRate > maximumRate
                        ? Math.floor((maximumRate * 1.2) / ONE_PERCENT)
                        : undefined,
            },
        },
        plugins: {
            tooltip: {
                ...options.plugins?.tooltip,
                callbacks: {
                    ...options.plugins?.tooltip?.callbacks,
                    label: (context: TooltipItem<keyof ChartTypeRegistry>) => {
                        if (
                            context.dataIndex === 0 &&
                            marketCloseToMaturityOriginalRate > maximumRate
                        ) {
                            return (
                                (
                                    marketCloseToMaturityOriginalRate /
                                    ONE_PERCENT
                                ).toFixed(3) + '%'
                            );
                        } else {
                            return context.formattedValue + '%';
                        }
                    },
                },
            },
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
