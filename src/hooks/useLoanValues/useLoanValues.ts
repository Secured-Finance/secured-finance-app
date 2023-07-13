import { useMemo } from 'react';
import { ContractMap, LendingMarket } from '../useLendingMarkets';
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
        Object.entries(lendingMarkets)
            .filter(o => filterFn(o[1]))
            .forEach(o => {
                let price = 0;
                switch (type) {
                    case RateType.Borrow:
                        price = o[1].borrowUnitPrice;
                        break;
                    case RateType.Lend:
                        price = o[1].lendUnitPrice;
                        break;
                    case RateType.MidRate:
                        price = o[1].midUnitPrice;
                        break;
                    default:
                        break;
                }
                loanValues.set(
                    o[1].maturity,
                    LoanValue.fromPrice(price, o[1].maturity)
                );
            });
        return loanValues;
    }, [filterFn, lendingMarkets, type]);
};
