import { SecuredFinanceClient } from '@secured-finance/sf-client';
import { useCallback, useEffect, useState } from 'react';
import { CurrencySymbol, toCurrency } from 'src/utils';
import { Maturity } from 'src/utils/entities';

type Market = {
    ccy: CurrencySymbol;
    maturity: Maturity;
    isItayosePeriod: boolean;
    isOpened: boolean;
    isPreOrderPeriod: boolean;
};

export const useMarket = (
    ccy: CurrencySymbol,
    maturity: Maturity,
    securedFinance: SecuredFinanceClient | undefined
) => {
    const [market, setMarket] = useState<Market | null>(null);
    const getMarket = useCallback(async () => {
        if (!securedFinance) return;
        const market = await securedFinance.getLendingMarket(
            toCurrency(ccy),
            maturity.toNumber()
        );

        if (
            !(
                market !== null &&
                (await market.resolvedAddress) !==
                    '0x0000000000000000000000000000000000000000'
            )
        ) {
            setMarket(null);
            return;
        }

        Promise.all([
            market.isItayosePeriod(),
            market.isOpened(),
            market.isPreOrderPeriod(),
        ])
            .then(([isItayosePeriod, isOpened, isPreOrderPeriod]) => {
                setMarket({
                    ccy,
                    maturity,
                    isItayosePeriod,
                    isOpened,
                    isPreOrderPeriod,
                });
            })
            .catch(e => {
                console.error(e);
                setMarket(null);
            });

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ccy, JSON.stringify(maturity), securedFinance]);

    useEffect(() => {
        getMarket();
    }, [getMarket]);

    return market;
};
