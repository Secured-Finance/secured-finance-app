import { OrderSide } from '@secured-finance/sf-client';
import { useDispatch, useSelector } from 'react-redux';
import { LineChart, getData } from 'src/components/molecules';
import { baseContracts, useLendingMarkets } from 'src/hooks';
import {
    selectLandingOrderForm,
    setMaturity,
} from 'src/store/landingOrderForm';
import { RootState } from 'src/store/types';
import { Rate } from 'src/utils';
import { LoanValue, Maturity } from 'src/utils/entities';
import { useRouter } from 'next/router';

export const LineChartTab = () => {
    const dispatch = useDispatch();
    const router = useRouter();

    const { side, maturity, currency } = useSelector((state: RootState) =>
        selectLandingOrderForm(state.landingOrderForm)
    );

    const { data: lendingMarkets = baseContracts } = useLendingMarkets();
    const lendingContracts = lendingMarkets[currency];

    const maturityIsAWeekAway = (timestamp: number) => {
        const targetDate = new Date(timestamp * 1000);
        const currentDate = new Date();
        const differenceInMilliseconds =
            targetDate.getTime() - currentDate.getTime();
        const millisecondsInAWeek = 7 * 24 * 60 * 60 * 1000;
        return differenceInMilliseconds <= millisecondsInAWeek;
    };

    const rates: Rate[] = [];
    const maturityList: MaturityListItem[] = [];
    let itayoseMarketIndex = 0;
    let currentIndex = 0;

    Object.values(lendingContracts).map(obj => {
        if (
            !(obj.isOpened || obj.isItayosePeriod || obj.isPreOrderPeriod) ||
            maturityIsAWeekAway(obj.maturity)
        ) {
            return;
        }
        maturityList.push({
            label: obj.name,
            maturity: obj.maturity,
            isPreOrderPeriod: obj.isPreOrderPeriod || obj.isItayosePeriod,
        });
        if (obj.isItayosePeriod || obj.isPreOrderPeriod) {
            rates.push(
                LoanValue.fromPrice(obj.openingUnitPrice, obj.maturity).apr
            );
            itayoseMarketIndex = currentIndex;
        } else {
            if (side === OrderSide.LEND) {
                rates.push(
                    LoanValue.fromPrice(obj.bestLendUnitPrice, obj.maturity).apr
                );
            } else {
                rates.push(
                    LoanValue.fromPrice(obj.bestBorrowUnitPrice, obj.maturity)
                        .apr
                );
            }
        }
        currentIndex += 1;
    });

    const data = getData(
        rates,
        side === OrderSide.BORROW ? 'Borrow' : 'Lend',
        maturityList.map(item => item.label),
        itayoseMarketIndex
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
