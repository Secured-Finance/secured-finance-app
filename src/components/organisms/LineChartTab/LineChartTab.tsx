import { ChartOptions, ChartTypeRegistry, TooltipItem } from 'chart.js';
import { useRouter } from 'next/router';
import { LineChart, getData, options } from 'src/components/molecules';
import { useIsGlobalItayose } from 'src/hooks';
import {
    useLandingOrderFormSelector,
    useLandingOrderFormStore,
} from 'src/store/landingOrderForm';
import {
    ButtonEvents,
    ButtonProperties,
    ONE_PERCENT,
    Rate,
    currencyMap,
} from 'src/utils';
import { Maturity } from 'src/utils/entities';
import { trackButtonEvent } from 'src/utils/events';

export const LineChartTab = ({
    rates,
    maturityList,
    itayoseMarketIndexSet,
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
    const { setMaturity } = useLandingOrderFormStore();
    const router = useRouter();

    const { data: isGlobalItayose } = useIsGlobalItayose();

    const { currency, maturity } = useLandingOrderFormSelector();

    const chartOptions: ChartOptions<'line'> = {
        ...options,
        scales: {
            ...options.scales,
            y: {
                ...options.scales?.y,
                position: 'right',
                max:
                    marketCloseToMaturityOriginalRate > maximumRate &&
                    maximumRate > 0
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
                        const { maturity, label } = maturityList[maturityIndex];
                        setMaturity(maturity);
                        trackButtonEvent(
                            ButtonEvents.TERM_CHANGE,
                            ButtonProperties.TERM,
                            label
                        );

                        const market = `${currency}-${label}`;

                        const pathname = '/';

                        router.push({
                            pathname,
                            query: {
                                market,
                            },
                        });
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
