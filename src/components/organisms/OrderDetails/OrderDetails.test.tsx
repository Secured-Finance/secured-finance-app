import { OrderSide } from '@secured-finance/sf-client';
import { composeStories } from '@storybook/react';
import { preloadedLendingMarkets } from 'src/stories/mocks/fixtures';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { fireEvent, render, screen, waitFor } from 'src/test-utils.js';
import * as stories from './OrderDetails.stories';

const { Default } = composeStories(stories);

const mockSecuredFinance = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mockSecuredFinance);

describe('OrderDetails Component', () => {
    it('should display the borrow remaining and the collateral usage if its a BORROW order', async () => {
        render(<Default />);

        expect(screen.getByText('Borrow Amount')).toBeInTheDocument();
        expect(screen.getByText('100 USDC')).toBeInTheDocument();
        expect(screen.getByText('Borrow Remaining')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('$9,513.72')).toBeInTheDocument();
        });

        expect(screen.getByText('Bond Price')).toBeInTheDocument();
        expect(screen.getByText('~ 94.10')).toBeInTheDocument();
        expect(screen.getByText('APR')).toBeInTheDocument();
        expect(screen.getByText('~ 6.28%')).toBeInTheDocument();
    });

    it('should render collateral utilization in borrow orders', async () => {
        render(<Default />);

        expect(screen.getByText('Collateral Usage')).toBeInTheDocument();
        expect(screen.getByText('37%')).toBeInTheDocument();
        expect(screen.getByText('37%')).toHaveClass('text-progressBarStart');
        await waitFor(() => {
            expect(screen.getByText('55%')).toBeInTheDocument();
            expect(screen.getByText('55%')).toHaveClass('text-progressBarVia');
        });
    });

    it('should display the circuit breaker disclaimer', async () => {
        render(<Default />, { preloadedState: preloadedLendingMarkets });

        const button = screen.getByTestId('disclaimer-button');
        expect(button).toHaveTextContent('Circuit Breaker Disclaimer');
        await waitFor(() => fireEvent.click(button));
        const disclaimerText = await screen.findByTestId('disclaimer-text');
        expect(disclaimerText).toHaveTextContent(
            'Circuit breaker will be triggered if the order is filled at over 96.72 which is the max slippage level at 1 block.'
        );
    });

    it('should not display the borrow remaining and the collateral usage if its a LEND order', () => {
        render(<Default side={OrderSide.LEND} />),
            { preloadedState: preloadedLendingMarkets };

        expect(screen.getByText('Lend Amount')).toBeInTheDocument();
        expect(screen.getByText('100 USDC')).toBeInTheDocument();
        expect(screen.queryByText('Borrow Remaining')).not.toBeInTheDocument();
        expect(screen.queryByText('Collateral Usage')).not.toBeInTheDocument();

        expect(screen.getByText('Bond Price')).toBeInTheDocument();
        expect(screen.getByText('~ 94.10')).toBeInTheDocument();
        expect(screen.getByText('APR')).toBeInTheDocument();
        expect(screen.getByText('~ 6.28%')).toBeInTheDocument();
    });
});
