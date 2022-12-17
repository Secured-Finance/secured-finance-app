import { SecuredFinanceClient } from '@secured-finance/sf-client';
import { BigNumber } from 'ethers';
import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'src/store/types';
import { CurrencySymbol, toCurrency } from 'src/utils';
import { Maturity } from 'src/utils/entities';
import { LoanValue } from 'src/utils/entities/loanValue';
import useSF from '../useSecuredFinance';

export enum RateType {
    Borrow = 0,
    Lend = 1,
    MidRate = 2,
}

export const useLoanValues = (
    ccy: CurrencySymbol,
    type: RateType,
    maturity: Maturity
) => {
    const securedFinance = useSF();
    const block = useSelector(
        (state: RootState) => state.blockchain.latestBlock
    );
    const [unitPrices, setUnitPrices] = useState<BigNumber[]>([]);

    const fetchYieldCurve = useCallback(
        async (securedFinance: SecuredFinanceClient) => {
            const currency = toCurrency(ccy);
            let priceFn;
            switch (type) {
                case RateType.Borrow:
                    priceFn = () => securedFinance.getLendUnitPrices(currency);
                    break;
                case RateType.Lend:
                    priceFn = () =>
                        securedFinance.getBorrowUnitPrices(currency);
                    break;
                case RateType.MidRate:
                    priceFn = () => securedFinance.getMidUnitPrices(currency);
                    break;
                default:
                    priceFn = () => Promise.resolve([]);
                    break;
            }
            setUnitPrices(await priceFn());
        },
        [type, ccy]
    );

    useEffect(() => {
        if (securedFinance) {
            fetchYieldCurve(securedFinance);
        }
    }, [fetchYieldCurve, securedFinance, block]);

    return unitPrices.map(unitPrice => {
        return LoanValue.fromPrice(unitPrice.toNumber(), maturity.toNumber());
    });
};
