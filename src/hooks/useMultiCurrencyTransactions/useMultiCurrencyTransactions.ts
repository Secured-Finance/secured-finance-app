import { useQuery } from '@apollo/client';
import { toBytes32 } from '@secured-finance/sf-graph-client';
import { TRANSACTIONS_BY_TIMESTAMP_CURRENCIES_AND_MATURITIES_QUERY } from '@secured-finance/sf-graph-client/dist/queries';
import { useMemo } from 'react';
import { Option } from 'src/components/atoms';
import { QueryTransaction } from 'src/types';
import { CurrencySymbol } from 'src/utils';
import { Maturity } from 'src/utils/entities';

type StructuredTransactions = Record<
    string,
    Record<string, QueryTransaction[]>
>;

export const useMultiCurrencyTransactions = (
    currencyList: Option<CurrencySymbol>[],
    maturityList: Option<Maturity>[]
) => {
    const timestamp = useMemo(() => Math.floor(Date.now() / 1000) - 86400, []);

    const variables = useMemo(
        () => ({
            timestamp,
            currencies: currencyList.map(i => toBytes32(i.value)),
            maturities: maturityList.map(i => Number(i.value)),
        }),
        [timestamp, currencyList, maturityList]
    );

    const { data: rawResult, loading } = useQuery(
        TRANSACTIONS_BY_TIMESTAMP_CURRENCIES_AND_MATURITIES_QUERY(
            variables.timestamp,
            variables.maturities,
            variables.currencies
        ),
        {
            skip: !currencyList.length || !maturityList.length,
        }
    );

    const structuredData: StructuredTransactions = useMemo(() => {
        const result: StructuredTransactions = {};

        currencyList.forEach((currency, currencyIndex) => {
            result[currency.label] = {};

            variables.maturities.forEach((maturity, maturityIndex) => {
                const key = `tx_${currencyIndex}_${maturityIndex}`;
                const txData = (
                    rawResult as Record<string, QueryTransaction[]>
                )?.[key];

                if (txData) {
                    result[currency.label][maturity.toString()] = txData;
                }
            });
        });

        return result;
    }, [rawResult, currencyList, variables.maturities]);

    return { data: structuredData, timestamp, loading };
};
