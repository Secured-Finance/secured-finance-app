import { composeStories } from '@storybook/react';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { render, screen, waitFor } from 'src/test-utils';
import * as stories from './AdvancedLendingEstimationFields.stories';

const { LimitOrder, MarketOrder, ShowDashes } = composeStories(stories);

const mockSecuredFinance = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mockSecuredFinance);

describe('AdvancedLendingEstimationFields Component', () => {
    it.skip('should render Limit Order Estimation values', async () => {
        render(<LimitOrder />, {
            preloadedState: {
                landingOrderForm: {
                    currency: 'WFIL',
                    amount: '100000000000000000000',
                    side: 0, // OrderSide.BORROW
                    orderType: 0, // OrderType.LIMIT
                    maturity: 1669852800, // dec22Fixture
                    unitPrice: undefined,
                    lastView: 'Simple',
                    sourceAccount: 0,
                    isBorrowedCollateral: false,
                },
            },
        });

        await waitFor(() => {
            expect(screen.getByText('Est. Price')).toBeInTheDocument();
            expect(screen.getByText('Est. APR')).toBeInTheDocument();
            expect(screen.getByText('Present Value')).toBeInTheDocument();
            expect(screen.getByText('Future Value')).toBeInTheDocument();

            expect(screen.getByTestId('Est. Price')).toHaveTextContent('80.00');
            expect(screen.getByTestId('Est. APR')).toHaveTextContent('25.03%');
            expect(screen.getByTestId('Present Value')).toHaveTextContent(
                '100 WFIL ($356.00)'
            );
            expect(screen.getByTestId('Future Value')).toHaveTextContent(
                '125 WFIL ($445.00)'
            );
        });
    });

    it('should render Market Order Estimation values', async () => {
        render(<MarketOrder />);

        await waitFor(() => {
            expect(screen.getByText('Est. Price')).toBeInTheDocument();
            expect(screen.getByText('Est. APR')).toBeInTheDocument();
            expect(screen.getByText('Present Value')).toBeInTheDocument();
            expect(screen.getByText('Future Value')).toBeInTheDocument();

            expect(screen.getByTestId('Est. Price')).toHaveTextContent('91.84');
            expect(screen.getByTestId('Est. APR')).toHaveTextContent('8.90%');
            expect(screen.getByTestId('Present Value')).toHaveTextContent(
                '90 WFIL ($320.40)'
            );
            expect(screen.getByTestId('Future Value')).toHaveTextContent(
                '98 WFIL ($348.88)'
            );
        });
    });

    it('should render dashes when orderbook is empty and order is Market', async () => {
        render(<ShowDashes />);

        await waitFor(() => {
            expect(screen.getByText('Est. Price')).toBeInTheDocument();
            expect(screen.getByText('Est. APR')).toBeInTheDocument();
            expect(screen.getByText('Present Value')).toBeInTheDocument();
            expect(screen.getByText('Future Value')).toBeInTheDocument();

            expect(screen.getByTestId('Est. Price')).toHaveTextContent('--');
            expect(screen.getByTestId('Est. APR')).toHaveTextContent('--');
            expect(screen.getByTestId('Present Value')).toHaveTextContent('--');
            expect(screen.getByTestId('Future Value')).toHaveTextContent('--');
        });
    });
});
