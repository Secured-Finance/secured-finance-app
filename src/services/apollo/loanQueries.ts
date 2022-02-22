import { gql } from '@apollo/client';

export const LOAN_DEALS = gql`
    query LoanDeals($account: Bytes!) {
        loans(where: { lender: $account }) {
            id
            lender
            borrower
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
`;

export const BORROW_DEALS = gql`
    query BorrowDeals($account: Bytes!) {
        loans(where: { borrower: $account }) {
            id
            lender
            borrower
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
`;

export const LOAN_INFO = gql`
    query Loan($id: String!) {
        loan(id: $id) {
            id
            lender
            borrower
            currency
            term
            amount
            couponPayment
            rate
            startTimestamp
            endTimestamp
            presentValue
            state
            schedule {
                payments {
                    id
                    notice
                    payment
                    amount
                    isDone
                    txHash
                }
            }
        }
    }
`;
