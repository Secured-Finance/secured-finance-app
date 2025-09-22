import { composeStories } from '@storybook/react';
import {
    fireEvent,
    render,
    screen,
    cleanupGraphQLMocks,
} from 'src/test-utils.js';
import { useTransactionHistoryQuery } from 'src/generated/subgraph';
import graphqlMocks from 'src/test-utils/mockData';
import * as stories from './RecentTradesTable.stories';

const { Default, Empty } = composeStories(stories);
jest.mock('src/generated/subgraph', () => ({
    ...jest.requireActual('src/generated/subgraph'),
    useTransactionHistoryQuery: jest.fn(),
}));

const getButton = (name: string) => screen.getByRole('button', { name });

describe('RecentTradesTable component', () => {
    const mockUseTransactionHistoryQuery = jest.mocked(
        useTransactionHistoryQuery
    );

    beforeEach(() => {
        // Default mock with transaction data
        mockUseTransactionHistoryQuery.mockReturnValue({
            data: {
                transactionHistory: [
                    {
                        id: 'transaction-1',
                        amount: '500000000000000000',
                        executionPrice: '960000000000000000',
                        side: 0,
                        currency:
                            '0x555344430000000000000000000000000000000000000000000000000000000',
                        maturity: '1703980800',
                        createdAt: '1671080520',
                        txHash: '0xabc123',
                        user: {
                            id: '0xB98bD7C7f656290071E52D1aA617D9cB4467Fd6D',
                        },
                    },
                    {
                        id: 'transaction-2',
                        amount: '1500000000000000000',
                        executionPrice: '940000000000000000',
                        side: 1,
                        currency:
                            '0x555344430000000000000000000000000000000000000000000000000000000',
                        maturity: '1703980800',
                        createdAt: '1671080521',
                        txHash: '0xdef456',
                        user: {
                            id: '0xB98bD7C7f656290071E52D1aA617D9cB4467Fd6D',
                        },
                    },
                ],
            },
            isLoading: false,
            error: null,
        } as ReturnType<typeof useTransactionHistoryQuery>);
    });

    afterEach(() => {
        // Clean up GraphQL mocks after each test
        cleanupGraphQLMocks();
        jest.clearAllMocks();
    });

    it('should display the Recent Trades Table', () => {
        render(<Default />, {
            graphqlMocks: graphqlMocks.withTransactions,
        });

        expect(
            screen.getByLabelText('Recent trades table')
        ).toBeInTheDocument();
    });

    it.skip('should display the spinner when loading', () => {
        render(<Default />, {
            graphqlMocks: graphqlMocks.withTransactions,
        });
        expect(
            screen.getByRole('alertdialog', { name: 'Loading' })
        ).toBeInTheDocument();
    });

    it('should not display the 100 trades notice if there are no entries', () => {
        // Override the mock to return empty transaction history
        mockUseTransactionHistoryQuery.mockReturnValue({
            data: {
                transactionHistory: [],
            },
            isLoading: false,
            error: null,
        } as ReturnType<typeof useTransactionHistoryQuery>);

        render(<Empty />, {
            graphqlMocks: graphqlMocks.empty,
        });
        expect(
            screen.queryByText('Only the last 100 trades are shown.')
        ).not.toBeInTheDocument();
    });

    it('should display the correct table header columns', () => {
        render(<Default />, {
            graphqlMocks: graphqlMocks.withTransactions,
        });

        expect(screen.getByText('Price')).toBeInTheDocument();
        expect(screen.getByText('Size (USDC)')).toBeInTheDocument();
        expect(screen.getByText('Time')).toBeInTheDocument();
    });

    it('should render three toggle buttons', () => {
        render(<Default />, {
            graphqlMocks: graphqlMocks.withTransactions,
        });
        expect(getButton('Show All Orders')).toBeInTheDocument();
        expect(getButton('Show Only Lend Orders')).toBeInTheDocument();
        expect(getButton('Show Only Borrow Orders')).toBeInTheDocument();
    });

    it('should render the Show All Orders button as active by default', () => {
        render(<Default />, {
            graphqlMocks: graphqlMocks.withTransactions,
        });
        expect(getButton('Show All Orders')).toHaveClass('bg-neutral-700');
        expect(getButton('Show Only Lend Orders')).not.toHaveClass(
            'bg-neutral-700'
        );
        expect(getButton('Show Only Borrow Orders')).not.toHaveClass(
            'bg-neutral-700'
        );
    });

    it('should toggle side buttons when they are clicked on', () => {
        render(<Default />, {
            graphqlMocks: graphqlMocks.withTransactions,
        });

        fireEvent.click(getButton('Show Only Borrow Orders'));
        expect(getButton('Show All Orders')).not.toHaveClass('bg-neutral-700');
        expect(getButton('Show Only Lend Orders')).not.toHaveClass(
            'bg-neutral-700'
        );
        expect(getButton('Show Only Borrow Orders')).toHaveClass(
            'bg-neutral-700'
        );

        fireEvent.click(getButton('Show Only Lend Orders'));
        expect(getButton('Show All Orders')).not.toHaveClass('bg-neutral-700');
        expect(getButton('Show Only Borrow Orders')).not.toHaveClass(
            'bg-neutral-700'
        );
        expect(getButton('Show Only Lend Orders')).toHaveClass(
            'bg-neutral-700'
        );
    });
});
