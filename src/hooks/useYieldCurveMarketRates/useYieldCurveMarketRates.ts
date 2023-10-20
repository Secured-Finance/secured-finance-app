import { OrderSide } from '@secured-finance/sf-client';
import { useSelector } from 'react-redux';
import { MaturityListItem } from 'src/components/organisms';
import { selectLandingOrderForm } from 'src/store/landingOrderForm';
import { RootState } from 'src/store/types';
import { Rate } from 'src/utils';
import { LoanValue } from 'src/utils/entities';
import { baseContracts, useLendingMarkets } from '../useLendingMarkets';

export const useYieldCurveMarketRates = () => {
    const { side, currency } = useSelector((state: RootState) =>
        selectLandingOrderForm(state.landingOrderForm)
    );

    const { data: lendingMarkets = baseContracts } = useLendingMarkets();
    const lendingContracts = lendingMarkets[currency];

    const rates: Rate[] = [];
    const maturityList: MaturityListItem[] = [];
    let itayoseMarketIndexSet = new Set<number>();
    let currentIndex = 0;
    let nearestMaturity = Number.POSITIVE_INFINITY;

    Object.values(lendingContracts).map(obj => {
        if (!(obj.isOpened || obj.isItayosePeriod || obj.isPreOrderPeriod))
            return;
        nearestMaturity = Math.min(nearestMaturity, obj.maturity);
        maturityList.push({
            label: obj.name,
            maturity: obj.maturity,
            isPreOrderPeriod: obj.isPreOrderPeriod || obj.isItayosePeriod,
        });
        if (obj.isItayosePeriod || obj.isPreOrderPeriod) {
            rates.push(
                LoanValue.fromPrice(obj.openingUnitPrice, obj.maturity).apr
            );
            itayoseMarketIndexSet.add(currentIndex);
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
