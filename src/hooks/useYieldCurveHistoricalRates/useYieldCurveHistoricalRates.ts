import { useQuery } from '@apollo/client';
import { toBytes32 } from '@secured-finance/sf-graph-client';
import { TRANSACTIONS_BY_TIMESTAMP_AND_MATURITY_QUERY } from '@secured-finance/sf-graph-client/dist/queries';
import { useMemo } from 'react';
import { MaturityListItem } from 'src/components/organisms';
import { useLandingOrderFormSelector } from 'src/store/landingOrderForm';
import { HistoricalYieldIntervals } from 'src/types';
import { Rate } from 'src/utils';
import { LoanValue } from 'src/utils/entities';
import { baseContracts, useLendingMarkets } from '../useLendingMarkets';
import { zeroRates } from './constant';

const useHistoricalRates = (maturityList: number[], currency: string) => {
    const intervals = useMemo(() => {
        const now = Math.floor(Date.now() / 1000);
        return Object.values(HistoricalYieldIntervals).map(
            offset => now - Number(offset)
        );
    }, []);

    const variables = useMemo(
        () => ({
            intervals,
            maturityList: maturityList,
            currency: toBytes32(currency),
        }),
        [intervals, maturityList, currency]
    );

    const { data, loading } = useQuery(
        TRANSACTIONS_BY_TIMESTAMP_AND_MATURITY_QUERY(
            variables.intervals,
            variables.maturityList,
            variables.currency
        )
    );
    return { data, loading, intervals };
};

export const useYieldCurveMarketRatesHistorical = () => {
    const { currency, maturity } = useLandingOrderFormSelector();
    const { data: lendingMarkets = baseContracts } = useLendingMarkets();
    const lendingContracts = lendingMarkets?.[currency] ?? {};

    // eslint-disable-next-line react-hooks/exhaustive-deps
    const maturityList: MaturityListItem[] = [];
    let maturities = [maturity];

    const sortedLendingContracts = Object.values(lendingContracts)
        .filter(
            obj => obj.isOpened || obj.isItayosePeriod || obj.isPreOrderPeriod
        )
        .sort((a, b) => a.maturity - b.maturity);

    if (sortedLendingContracts.length) {
        sortedLendingContracts.forEach(obj => {
            maturityList.push({
                label: obj.name,
                maturity: obj.maturity,
                isPreOrderPeriod: obj.isPreOrderPeriod || obj.isItayosePeriod,
            });
        });
        maturities = maturityList
            .filter(i => i.isPreOrderPeriod !== true)
            .map(i => i.maturity);
    }

    const { data, loading, intervals } = useHistoricalRates(
        maturities,
        currency
    );

    const historicalRates = useMemo(() => {
        const newRates: Record<HistoricalYieldIntervals, Rate[]> = {
            ...zeroRates,
        };

        Object.keys(HistoricalYieldIntervals).forEach((intervalKey, i) => {
            const rates: Rate[] = [];

            maturityList
                .filter(i => i.isPreOrderPeriod !== true)
                .forEach((item, j) => {
                    const key = `tx${i}_${j}`;
                    const tx = data?.[key]?.[0];

                    const executionPrice = tx?.executionPrice;

                    const rate = executionPrice
                        ? LoanValue.fromPrice(
                              executionPrice,
                              item.maturity,
                              intervals[i]
                          ).apr
                        : new Rate(0);

                    rates.push(rate);
                });

            const enumKey =
                HistoricalYieldIntervals[
                    intervalKey as keyof typeof HistoricalYieldIntervals
                ];
            newRates[enumKey] = rates;
        });

        return newRates;
    }, [data, maturityList, intervals]);

    return { historicalRates, loading };
};
