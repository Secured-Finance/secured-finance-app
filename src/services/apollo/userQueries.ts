import { gql } from '@apollo/client';

export const OPEN_ORDERS = gql`
    query OpenOrders($account: Bytes!, $market: Bytes!) {
        user(id: $account) {
            openOrders(
                where: { marketAddr: $market }
                orderBy: createdAtTimestamp
                orderDirection: asc
            ) {
                id
                orderId
                currency
                side
                marketAddr
                term
                rate
                amount
                deadline
                maker
                createdAtTimestamp
                createdAtBlockNumber
            }
        }
    }
`;

export const TRADE_HISTORY = gql`
    query TradingHistory($account: Bytes!, $market: Bytes!) {
        user(id: $account) {
            takenOrders(
                where: { marketAddr: $market }
                orderBy: createdAtTimestamp
                orderDirection: desc
            ) {
                id
                orderId
                currency
                side
                marketAddr
                term
                rate
                amount
                maker
                taker
                createdAtTimestamp
                createdAtBlockNumber
            }
            madeOrders(
                where: { marketAddr: $market }
                orderBy: createdAtTimestamp
                orderDirection: desc
            ) {
                id
                orderId
                currency
                side
                marketAddr
                term
                rate
                amount
                maker
                taker
                createdAtTimestamp
                createdAtBlockNumber
            }
        }
    }
`;

export const OPEN_LOANS = gql`
    query OpenLoans($account: Bytes!, $currency: Int!, $term: Int!) {
        user(id: $account) {
            loans(where: { currency: $currency, term: $term }) {
                id
                lender
                borrower
                borrowerUser {
                    collateral {
                        inuseETH
                        coverage
                    }
                }
                side
                currency
                term
                amount
                couponPayment
                rate
                startTimestamp
                endTimestamp
                presentValue
                state
            }
        }
    }
`;
