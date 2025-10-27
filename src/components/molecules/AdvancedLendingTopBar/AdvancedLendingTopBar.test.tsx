import { composeStories } from '@storybook/react';
import { render, screen, cleanupGraphQLMocks } from 'src/test-utils.js';
import graphqlMocks from 'src/test-utils/mockData';
import * as stories from './AdvancedLendingTopBar.stories';

const { Default } = composeStories(stories);

// Mock the TransactionHistory hook to avoid GraphQL query issues
// Return empty transaction history so the component shows "--" for last price
jest.mock('src/generated/subgraph', () => ({
    ...jest.requireActual('src/generated/subgraph'),
    useTransactionHistoryQuery: jest.fn(() => ({
        data: {
            transactionHistory: [], // Empty to show no last price
        },
        isLoading: false,
        error: null,
    })),
}));

describe('AdvancedLendingTopBar Component', () => {
    afterEach(() => {
        cleanupGraphQLMocks();
    });

    it('should render a AdvancedLendingTopBar with the values', () => {
        render(<Default />, {
            graphqlMocks: graphqlMocks.withTransactions,
        });

        expect(
            screen.getByRole('button', { name: 'WFIL-DEC2022' })
        ).toBeInTheDocument();
        expect(screen.getByText('Maturity Dec 1, 2022')).toBeInTheDocument();

        expect(screen.getByText('Mark Price')).toBeInTheDocument();
        expect(screen.getByText('80.00')).toBeInTheDocument();

        expect(screen.getByText('Last Price')).toBeInTheDocument();
        expect(screen.getByText('--.--')).toBeInTheDocument();

        expect(screen.getByText('WFIL Price')).toBeInTheDocument();
        expect(screen.getByText('$3.56')).toBeInTheDocument();
    });

    it('should render source link for the selected asset', () => {
        render(<Default />, {
            graphqlMocks: graphqlMocks.withTransactions,
        });

        expect(
            screen.getByRole('button', { name: 'WFIL-DEC2022' })
        ).toBeInTheDocument();
        const source = screen.getByRole('link');
        expect(source).toBeInTheDocument();
        expect(source).toHaveAttribute(
            'href',
            'https://www.coingecko.com/en/coins/filecoin'
        );
    });
});
