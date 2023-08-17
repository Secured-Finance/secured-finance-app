import { useMemo } from 'react';
import { ContractMap, LendingMarket } from 'src/hooks/useLendingMarkets';
import { LoanValue } from 'src/utils/entities/loanValue';

export enum RateType {
    Borrow = 0,
    Lend = 1,
    MidRate = 2,
}

const passThrough = () => true;

export const useLoanValues = (
    lendingMarkets: ContractMap,
    type: RateType,
    filterFn: (market: LendingMarket) => unknown = passThrough
) => {
    return useMemo(() => {
        const loanValues = new Map<number, LoanValue>();
        Object.values(lendingMarkets)
            .filter(o => filterFn(o))
            .forEach(o => {
                let price = 0;
                switch (type) {
                    case RateType.Borrow:
                        price = o.bestBorrowUnitPrice;
                        break;
                    case RateType.Lend:
                        price = o.bestLendUnitPrice;
                        break;
                    case RateType.MidRate:
                        price = o.midUnitPrice;
                        break;
                    default:
                        break;
                }
                loanValues.set(
                    o.maturity,
                    LoanValue.fromPrice(price, o.maturity)
                );
            });
        return loanValues;
    }, [filterFn, lendingMarkets, type]);
};
