import { useSelector } from 'react-redux';
import { selectLandingOrderForm } from 'src/store/landingOrderForm';
import { RootState } from 'src/store/types';
import { HistoricalYieldIntervals } from 'src/types';
import { Rate, isMaturityPastDays } from 'src/utils';
import { LoanValue } from 'src/utils/entities';
import { baseContracts, useLendingMarkets } from '../useLendingMarkets';

export const useYieldCurveMarketRatesHistorical = () => {
    const { currency } = useSelector((state: RootState) =>
        selectLandingOrderForm(state.landingOrderForm)
    );

    const { data: lendingMarkets = baseContracts } = useLendingMarkets();
    const lendingContracts = lendingMarkets[currency];

    const historicalRates: Record<HistoricalYieldIntervals, Rate[]> = {
        [HistoricalYieldIntervals['30M']]: [],
        [HistoricalYieldIntervals['1H']]: [],
        [HistoricalYieldIntervals['4H']]: [],
        [HistoricalYieldIntervals['1D']]: [],
        [HistoricalYieldIntervals['1W']]: [],
        [HistoricalYieldIntervals['1MTH']]: [],
    };
    const itayoseMarketIndexSet = new Set<number>();
    let currentIndex = 0;
    let maximumRate = 0;
    let isFirstMarketCloseToMaturity = true;

    const sortedLendingContracts = Object.values(lendingContracts)
        .filter(
            obj => obj.isOpened || obj.isItayosePeriod || obj.isPreOrderPeriod
        )
        .sort((a, b) => a.maturity - b.maturity);

    Object.keys(historicalRates).forEach(interval => {
        const rates: Rate[] = [];
        if (isMaturityPastDays(sortedLendingContracts[0]?.maturity, 7, true)) {
            isFirstMarketCloseToMaturity = false;
            maximumRate = Number.MAX_VALUE;
        }

        sortedLendingContracts.forEach(obj => {
            let rate: Rate;
            if (obj.isItayosePeriod || obj.isPreOrderPeriod) {
                rate = LoanValue.fromPrice(
                    obj.openingUnitPrice,
                    obj.maturity,
                    obj.utcOpeningDate
                ).apr;
                itayoseMarketIndexSet.add(currentIndex);
            } else {
                rate = LoanValue.fromPrice(
                    obj.marketUnitPrice,
                    obj.maturity,
                    Date.now() / Number(interval) - 86400
                ).apr;
            }
            rates.push(rate);

            if (isFirstMarketCloseToMaturity) {
                if (isMaturityPastDays(obj.maturity, 7, true)) {
                    maximumRate = Math.max(maximumRate, rate.toNumber());
                }
            }

            currentIndex += 1;
        });

        if (rates[0]?.toNumber() > maximumRate && maximumRate > 0) {
            rates[0] = new Rate(maximumRate * 1.25);
        }
        historicalRates[interval as HistoricalYieldIntervals] = rates;
    });

    /*
    In case, the first market is going to mature within a week, we don't want to show the original price on the chart
    since the curve won't look good. We replace the first market's price with a price higher than the highest market
    price on the chart to create a more consistent curve.

    The maximum value of y-scale and the first market's price are calculated relative to the maximum rate to achieve
    a decent looking curve. 1.25(for market rate) and 1.2(for scale) are magic numbers chosen to create the most
    pleasing curve.
    */

    return historicalRates;
};
