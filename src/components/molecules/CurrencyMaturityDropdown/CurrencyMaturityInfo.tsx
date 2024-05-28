import { toBytes32 } from '@secured-finance/sf-graph-client';
import queries from '@secured-finance/sf-graph-client/dist/graphclients/';
import { useEffect, useMemo, useState } from 'react';
import {
    ContractMap,
    useGraphClientHook,
    useIsSubgraphSupported,
    useMaturityOptions,
    useTradeHistoryDetails,
} from 'src/hooks';
import useSF from 'src/hooks/useSecuredFinance';
import { CurrencySymbol, formatLoanValue, ordinaryFormat } from 'src/utils';
import { Maturity } from 'src/utils/entities';

export const CurrencyMaturityInfo = ({
    currency,
    maturity,
    lendingContracts,
    index,
}: {
    currency: CurrencySymbol;
    maturity: Maturity;
    lendingContracts: ContractMap;
    index: number;
}) => {
    const [timestamp, setTimestamp] = useState<number>(1643713200);
    const securedFinance = useSF();
    const currentChainId = securedFinance?.config.chain.id;

    const isSubgraphSupported = useIsSubgraphSupported(currentChainId);

    useEffect(() => {
        setTimestamp(Math.round(new Date().getTime() / 1000));
    }, []);

    const maturityOptionList = useMaturityOptions(
        lendingContracts,
        market => market.isOpened
    );

    const transactionHistory = useGraphClientHook(
        {
            currency: toBytes32(currency),
            maturity: maturity,
            from: timestamp - 24 * 3600,
            // from: Math.round(
            //     (new Date().getTime() - 90 * 24 * 60 * 60 * 1000) / 1000
            // ),
            to: timestamp,
        },
        queries.TransactionHistoryDocument,
        'transactionHistory',
        !isSubgraphSupported
    ).data;

    const selectedTerm = useMemo(() => {
        return (
            maturityOptionList.find(option =>
                option.value.equals(new Maturity(+maturity))
            ) || maturityOptionList[0]
        );
    }, [maturity, maturityOptionList]);

    const tradeHistoryDetails = useTradeHistoryDetails(
        transactionHistory ?? [],
        currency,
        selectedTerm.value
    );

    let values = undefined;

    if (isSubgraphSupported) {
        values = [
            formatLoanValue(tradeHistoryDetails.max, 'price'),
            formatLoanValue(tradeHistoryDetails.min, 'price'),
            tradeHistoryDetails.count.toString(),
            tradeHistoryDetails.sum
                ? ordinaryFormat(tradeHistoryDetails.sum)
                : '-',
        ];
    }

    return <span>{values && values[index] ? values[index] : 0}</span>;
};
