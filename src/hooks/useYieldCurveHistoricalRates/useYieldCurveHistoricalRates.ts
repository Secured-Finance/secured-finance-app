import { useQuery } from '@apollo/client';
import { toBytes32 } from '@secured-finance/sf-graph-client';
import { TRANSACTIONS_BY_TIMESTAMP_AND_MATURITY_QUERY } from '@secured-finance/sf-graph-client/dist/queries';
import { useMemo } from 'react';
import { MaturityListItem } from 'src/components/organisms';
import { HistoricalYieldIntervals } from 'src/types';
import { CurrencySymbol, Rate } from 'src/utils';
import { LoanValue } from 'src/utils/entities';
import { mockRates } from './constant';

const useHistoricalRates = (
    maturityList: MaturityListItem[],
    currency: string
) => {
    const intervals = useMemo(() => {
        const now = Math.floor(Date.now() / 1000);
        return Object.values(HistoricalYieldIntervals).map(
            offset => now - Number(offset)
        );
    }, []);

    const variables = useMemo(
        () => ({
            intervals,
            maturityList: maturityList
                .slice(0, maturityList.length - 1)
                .map(i => i.maturity),
            currency: toBytes32(currency),
        }),
        [intervals, maturityList, currency]
    );

    const query = TRANSACTIONS_BY_TIMESTAMP_AND_MATURITY_QUERY(
        variables.intervals,
        variables.maturityList,
        variables.currency
    );

    const { data, loading } = useQuery(query);

    return { data, loading, intervals };
};

export const useYieldCurveMarketRatesHistorical = (
    maturityList: MaturityListItem[],
    currency: CurrencySymbol
) => {
    const { data, loading, intervals } = useHistoricalRates(
        maturityList,
        currency
    );

    const historicalRates = useMemo(() => {
        if (!data || !maturityList.length || !intervals.length) {
            return mockRates;
        }

        const newRates: Record<HistoricalYieldIntervals, Rate[]> = {
            ...mockRates,
        };
        const list = maturityList.slice(0, maturityList.length - 1);

        Object.keys(HistoricalYieldIntervals).forEach((intervalKey, i) => {
            const rates: Rate[] = [];

            list.forEach((item, j) => {
                const key = `tx${i}_${j}`;
                const tx = data?.[key]?.[0];
                const executionPrice = tx?.executionPrice || 0;

                const rate = LoanValue.fromPrice(
                    executionPrice,
                    item.maturity,
                    intervals[i]
                ).apr;

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
