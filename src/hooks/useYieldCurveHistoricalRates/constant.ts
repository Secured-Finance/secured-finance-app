import { gql } from '@apollo/client';
import { MaturityListItem } from 'src/components/organisms';

export const TRANSACTIONS_QUERY = (
    intervals: number[],
    maturityList: MaturityListItem[],
    currency: string
) => {
    const queryParts = intervals.flatMap((timestamp, i) => {
        return maturityList.map((item, j) => {
            return `
            tx${i}_${j}:transactions(
                where: {
                    createdAt_lte: ${timestamp}
                    maturity: ${item.maturity}
                    currency: "${currency}"
                }
                orderBy: createdAt
                orderDirection: desc
                first: 1
            ) {
                amount
                averagePrice
                executionPrice
                createdAt
                currency
                maturity
            }
            `;
        });
    });

    return gql`
        query Transactions {
            ${queryParts}
        }
    `;
};
