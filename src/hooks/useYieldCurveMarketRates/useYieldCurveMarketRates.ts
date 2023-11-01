import { useSelector } from 'react-redux';
import { MaturityListItem } from 'src/components/organisms';
import { selectLandingOrderForm } from 'src/store/landingOrderForm';
import { RootState } from 'src/store/types';
import { Rate, isMaturityPastDays } from 'src/utils';
import { LoanValue } from 'src/utils/entities';
import { baseContracts, useLendingMarkets } from '../useLendingMarkets';

export const useYieldCurveMarketRates = () => {
    const { currency } = useSelector((state: RootState) =>
        selectLandingOrderForm(state.landingOrderForm)
    );

    const { data: lendingMarkets = baseContracts } = useLendingMarkets();
    const lendingContracts = lendingMarkets[currency];

    const rates: Rate[] = [];
    const maturityList: MaturityListItem[] = [];
    const itayoseMarketIndexSet = new Set<number>();
    let currentIndex = 0;
    let maximumRate = 0;
    let nearestMarketOriginalRate = 0;

    const sortedLendingContracts = Object.values(lendingContracts)
        .filter(
            obj => obj.isOpened || obj.isItayosePeriod || obj.isPreOrderPeriod
        )
        .sort((a, b) => a.maturity - b.maturity);

    if (isMaturityPastDays(sortedLendingContracts[0]?.maturity, 7, true)) {
        maximumRate = Number.MAX_VALUE;
    }

    sortedLendingContracts.forEach(obj => {
        if (obj.isItayosePeriod || obj.isPreOrderPeriod || obj.isOpened) {
            maturityList.push({
                label: obj.name,
                maturity: obj.maturity,
                isPreOrderPeriod: obj.isPreOrderPeriod || obj.isItayosePeriod,
            });

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
                    obj.maturity
                ).apr;
            }

            rates.push(rate);
            if (isMaturityPastDays(obj.maturity, 7, true)) {
                maximumRate = Math.max(maximumRate, rate.toNumber());
            } else {
                nearestMarketOriginalRate = rate.toNumber();
            }
            currentIndex += 1;
        }
    });

    if (rates[0]?.toNumber() > maximumRate) {
        rates[0] = new Rate(maximumRate * 1.2);
    }

    return {
        rates,
        maturityList,
        itayoseMarketIndexSet,
        maximumRate: maximumRate,
        nearestMarketOriginalRate,
    };
};
