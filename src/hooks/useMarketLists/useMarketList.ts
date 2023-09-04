import { utils } from 'ethers';
import { shallowEqual, useSelector } from 'react-redux';
import { RootState } from 'src/store/types';
import { CurrencySymbol, getCurrencyMapAsList } from 'src/utils';
import { LendingMarket } from '../useLendingMarkets';

export const useMarketLists = () => {
    const lendingContracts = useSelector(
        (state: RootState) => state.availableContracts.lendingMarkets,
        shallowEqual
    );
    const openMarkets: Market[] = [];
    const itayoseMarkets: Market[] = [];

    for (const ccy of getCurrencyMapAsList()) {
        for (const maturity of Object.keys(lendingContracts[ccy.symbol])) {
            const contract = lendingContracts[ccy.symbol][Number(maturity)];
            if (contract.isMatured) continue;

            const isItayoseOrPreOrder =
                contract.isItayosePeriod || contract.isPreOrderPeriod;

            const market = {
                ...contract,
                ccy: ccy.symbol,
                currency: utils.formatBytes32String(ccy.symbol),
            };

            if (isItayoseOrPreOrder) {
                itayoseMarkets.push(market);
            } else {
                openMarkets.push(market);
            }
        }
    }

    return { openMarkets, itayoseMarkets };
};

export type Market = LendingMarket & {
    currency: string;
    ccy: CurrencySymbol;
};
