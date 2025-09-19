import { composeStories } from '@storybook/react';
import {
    fireEvent,
    render,
    screen,
    cleanupGraphQLMocks,
} from 'src/test-utils.js';
import graphqlMocks from 'src/test-utils/mockData';
import * as stories from './HistoricalWidget.stories';

const { Default } = composeStories(stories);

// Mock the TransactionCandleStick hook to avoid GraphQL query issues
jest.mock('src/generated/subgraph', () => ({
    ...jest.requireActual('src/generated/subgraph'),
    useTransactionCandleStickQuery: jest.fn(() => ({
        data: {
            transactionCandleSticks: [
                {
                    currency:
                        '0x5746494c00000000000000000000000000000000000000000000000000000000',
                    maturity: '1669852800',
                    interval: '300',
                    timestamp: '1704499200',
                    open: '6578',
                    high: '6791',
                    low: '6522',
                    close: '6703',
                    average: '6648.5',
                    volume: '46095508482200000000',
                    volumeInFV: '37983242770',
                },
            ],
        },
        isLoading: false,
        error: null,
    })),
}));

describe('HistoricalWidget', () => {
    afterEach(() => {
        cleanupGraphQLMocks();
    });

    it('should render timescales', () => {
        render(<Default />, {
            graphqlMocks: graphqlMocks.withTransactions,
        });
        const timeScalesContainer = screen.getByTestId('timescale-selector');
        expect(timeScalesContainer).toBeInTheDocument();
    });

    it('should render 5M as the initial time scale', () => {
        render(<Default />, {
            graphqlMocks: graphqlMocks.withTransactions,
        });
        const timeScale = screen.getByTestId('5M');
        expect(timeScale).toBeInTheDocument();
        expect(timeScale).toHaveClass('bg-starBlue');
    });

    it('should change time scale when selected', () => {
        render(<Default />, {
            graphqlMocks: graphqlMocks.withTransactions,
        });
        const initialTimeScale = screen.getByTestId('5M');
        expect(initialTimeScale).toBeInTheDocument();
        expect(initialTimeScale).toHaveClass('bg-starBlue');

        const selectedTimeScale = screen.getByTestId('1H');
        fireEvent.click(selectedTimeScale);
        expect(selectedTimeScale).toHaveClass('bg-starBlue');
        expect(initialTimeScale).not.toHaveClass('bg-starBlue');
    });
});
