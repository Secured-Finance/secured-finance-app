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
            .map(o => {
                switch (type) {
                    case RateType.Borrow:
                        loanValues.set(
                            o[1].maturity,
                            LoanValue.fromPrice(
                                o[1].borrowUnitPrice,
                                o[1].maturity
                            )
                        );
                        break;
                    case RateType.Lend:
                        loanValues.set(
                            o[1].maturity,
                            LoanValue.fromPrice(
                                o[1].lendUnitPrice,
                                o[1].maturity
                            )
                        );
                        break;
                    case RateType.MidRate:
                        loanValues.set(
                            o[1].maturity,
                            LoanValue.fromPrice(
                                o[1].midUnitPrice,
                                o[1].maturity
                            )
                        );
                        break;
                }
            });
        return loanValues;
    }, [filterFn, lendingMarkets, type]);
};
