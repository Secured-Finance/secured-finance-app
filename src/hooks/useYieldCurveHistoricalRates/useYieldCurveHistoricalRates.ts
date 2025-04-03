import { useQuery } from '@apollo/client';
import { toBytes32 } from '@secured-finance/sf-graph-client';
import { useEffect, useMemo, useState } from 'react';
import { MaturityListItem } from 'src/components/organisms';
import { HistoricalYieldIntervals } from 'src/types';
import { Rate } from 'src/utils';
import { LoanValue } from 'src/utils/entities';
import { TRANSACTIONS_QUERY } from './constant';

export const useYieldCurveMarketRatesHistorical = (
    maturityList: MaturityListItem[],
    currency: string
) => {
    const [historicalRates, setHistoricalRates] = useState<
        Record<HistoricalYieldIntervals, Rate[]>
    >({
        [HistoricalYieldIntervals['30M']]: [],
        [HistoricalYieldIntervals['1H']]: [],
        [HistoricalYieldIntervals['4H']]: [],
        [HistoricalYieldIntervals['1D']]: [],
        [HistoricalYieldIntervals['1W']]: [],
        [HistoricalYieldIntervals['1MTH']]: [],
    });

    const intervals = useMemo(() => {
        const currentTime = Math.floor(Date.now() / 1000);
        return Object.keys(historicalRates).map(
            interval => currentTime - Number(interval)
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const queryVariables = useMemo(
        () => ({
            intervals,
            maturityList: maturityList.slice(0, maturityList.length - 1),
            currency: toBytes32(currency),
        }),
        [maturityList, currency, intervals]
    );

    const { data, loading } = useQuery(
        TRANSACTIONS_QUERY(
            queryVariables.intervals,
            queryVariables.maturityList,
            queryVariables.currency
        )
    );

    useEffect(() => {
        if (!data || !maturityList.length) return;

        const newRates = { ...historicalRates };
        let hasChanges = false;

        Object.keys(historicalRates).forEach((intervalKey, i) => {
            const rates: Rate[] = [];
            const list = maturityList.slice(0, maturityList.length - 1);

            list.forEach((item, j) => {
                const transactionKey = `tx${i}_${j}`;
                const transaction = data[transactionKey]?.[0];
                const executionPrice = transaction?.executionPrice || 0;

                const rate = LoanValue.fromPrice(
                    executionPrice,
                    item.maturity,
                    intervals[i]
                ).apr;

                rates.push(rate);
            });

            if (
                JSON.stringify(rates) !==
                JSON.stringify(
                    newRates[intervalKey as HistoricalYieldIntervals]
                )
            ) {
                newRates[intervalKey as HistoricalYieldIntervals] = rates;
                hasChanges = true;
            }
        });

        if (hasChanges) {
            setHistoricalRates(newRates);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [data, maturityList, intervals]);

    return { historicalRates, loading };
};
