import { utils } from 'ethers';
import { useMemo } from 'react';
import {
    LendingMarket,
    baseContracts,
    useLendingMarkets,
    useCurrencyDelistedStatus,
} from 'src/hooks';
import { CurrencySymbol, getCurrencyMapAsList } from 'src/utils';

export const useMarketLists = () => {
    const { data: lendingContracts = baseContracts } = useLendingMarkets();

    const { data: currencyDelistedStatusSet } = useCurrencyDelistedStatus();

    const marketLists = useMemo(() => {
        const openMarkets: Market[] = [];
        const itayoseMarkets: Market[] = [];

        for (const ccy of getCurrencyMapAsList()) {
            for (const maturity of Object.keys(lendingContracts[ccy.symbol])) {
                const contract = lendingContracts[ccy.symbol][Number(maturity)];
                if (contract.isMatured) continue;

                const isItayoseOrPreOrder =
                    (contract.isItayosePeriod || contract.isPreOrderPeriod) &&
                    !currencyDelistedStatusSet.has(ccy.symbol);

                const market = {
                    ...contract,
                    ccy: ccy.symbol,
                    currency: utils.formatBytes32String(ccy.symbol),
                };

                if (isItayoseOrPreOrder) {
                    itayoseMarkets.push(market);
                } else if (contract.isOpened) {
                    openMarkets.push(market);
                }
            }
        }

        return { openMarkets, itayoseMarkets };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [JSON.stringify(lendingContracts)]);

    return marketLists;
};

export type Market = LendingMarket & {
    currency: string;
    ccy: CurrencySymbol;
};
