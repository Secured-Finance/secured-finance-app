import { useSelector } from 'react-redux';
import { MaturityListItem } from 'src/components/organisms';
import { selectLandingOrderForm } from 'src/store/landingOrderForm';
import { RootState } from 'src/store/types';
import { Rate } from 'src/utils';
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
    let itayoseMarketIndexSet = new Set<number>();
    let currentIndex = 0;

    const sortedLendingContracts = Object.values(lendingContracts)
        .filter(
            obj => obj.isOpened || obj.isItayosePeriod || obj.isPreOrderPeriod
        )
        .sort((a, b) => a.maturity - b.maturity);

    sortedLendingContracts.forEach(obj => {
        if (obj.isItayosePeriod || obj.isPreOrderPeriod || obj.isOpened) {
            maturityList.push({
                label: obj.name,
                maturity: obj.maturity,
                isPreOrderPeriod: obj.isPreOrderPeriod || obj.isItayosePeriod,
            });

            if (obj.isItayosePeriod || obj.isPreOrderPeriod) {
                rates.push(
                    LoanValue.fromPrice(
                        obj.openingUnitPrice,
                        obj.maturity,
                        obj.utcOpeningDate
                    ).apr
                );
                itayoseMarketIndexSet.add(currentIndex);
            } else {
                rates.push(
                    LoanValue.fromPrice(obj.marketUnitPrice, obj.maturity).apr
                );
            }
            currentIndex += 1;
        }
    });

    if (
        itayoseMarketIndexSet.size > 0 &&
        !itayoseMarketIndexSet.has(0) &&
        rates.length > 8
    ) {
        rates.shift();
        maturityList.shift();
        itayoseMarketIndexSet = new Set(
            Array.from(itayoseMarketIndexSet, value => value - 1)
        );
    }

    return { rates, maturityList, itayoseMarketIndexSet };
};
