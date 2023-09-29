import { OrderSide } from '@secured-finance/sf-client';
import { useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { LineChart, getData } from 'src/components/molecules';
import { baseContracts, useLendingMarkets } from 'src/hooks';
import {
    selectLandingOrderForm,
    setMaturity,
} from 'src/store/landingOrderForm';
import { RootState } from 'src/store/types';
import { MaturityOptionList } from 'src/types';
import { Rate } from 'src/utils';
import { LoanValue, Maturity } from 'src/utils/entities';

export const LineChartTab = ({
    maturitiesOptionList,
}: {
    maturitiesOptionList: MaturityOptionList;
    rates: Rate[];
}) => {
    const dispatch = useDispatch();
    const { side, maturity, currency } = useSelector((state: RootState) =>
        selectLandingOrderForm(state.landingOrderForm)
    );

    const { data: lendingMarkets = baseContracts } = useLendingMarkets();
    const lendingContracts = lendingMarkets[currency];

    // console.log(lendingContracts);

    // const isAWeekAway = (timetsamp: number) => {
    //     const timestamp = 1695945600; // Replace this with your actual timestamp

    //     // Convert the timestamp to a Date object
    //     const targetDate = new Date(timestamp * 1000); // Multiply by 1000 to convert seconds to milliseconds

    //     // Get the current date
    //     const currentDate = new Date();

    //     // Calculate the difference in milliseconds
    //     const differenceInMilliseconds =
    //         targetDate.getTime() - currentDate.getTime();

    //     // Calculate the number of milliseconds in a week
    //     const millisecondsInAWeek = 7 * 24 * 60 * 60 * 1000;

    //     // Check if the difference is less than or equal to a week
    //     return differenceInMilliseconds <= millisecondsInAWeek;
    // };

    const maturityList = Object.values(lendingContracts).map(obj => obj.name);

    const loanValues = Object.values(lendingContracts).map(obj => {
        if (obj.isItayosePeriod) {
            return LoanValue.fromPrice(obj.openingUnitPrice, obj.maturity);
        } else {
            return side === OrderSide.BORROW
                ? LoanValue.fromPrice(obj.bestBorrowUnitPrice, obj.maturity)
                : LoanValue.fromPrice(obj.bestLendUnitPrice, obj.maturity);
        }
    });

    const rates = Array.from(loanValues.values()).map(v => v.apr);

    const itayoseMarketIndex = useMemo(
        () =>
            Object.values(lendingContracts).findIndex(
                market => market.isItayosePeriod && !market.isPreOrderPeriod
            ),
        [lendingContracts]
    );

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
