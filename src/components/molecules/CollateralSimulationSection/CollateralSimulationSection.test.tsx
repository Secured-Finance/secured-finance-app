import { composeStories } from '@storybook/react';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { fireEvent, render, screen, waitFor } from 'src/test-utils.js';
import * as stories from './CollateralSimulationSection.stories';

const { Trade } = composeStories(stories);

const mockSecuredFinance = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mockSecuredFinance);

describe('CollateralSimulationSection Component', () => {
    it('should render a CollateralSimulationSection', async () => {
        render(<Trade />);
    });

    it('should display the borrow remaining and the collateral usage', async () => {
        render(<Trade />);

        await waitFor(() => {
            expect(screen.getByText('Borrow Remaining')).toBeInTheDocument();
            expect(screen.getByText('$9,135.50')).toBeInTheDocument();
        });

        expect(screen.getByText('Collateral Usage')).toBeInTheDocument();
    });

    it('should increase the collateral usage when the tradePosition is BORROW', async () => {
        render(<Trade />);
        expect(screen.getByText('37%')).toBeInTheDocument();
        expect(screen.getByText('37%')).toHaveClass('text-progressBarStart');
        await waitFor(() => {
            expect(screen.getByText('55%')).toBeInTheDocument();
            expect(screen.getByText('55%')).toHaveClass('text-progressBarVia');
        });
    });

    it('should display a checkbox for applying borrowed amount as collateral', async () => {
        const { store } = render(<Trade />);

        expect(screen.getByText('Apply Borrowing Asset as Collateral'));
        expect(screen.getByRole('checkbox')).toBeInTheDocument();
        expect(store.getState().landingOrderForm.isBorrowedCollateral).toEqual(
            false
        );
        const checkbox = screen.getByRole('checkbox');
        await waitFor(() => {
            fireEvent.click(checkbox);
        });
        expect(store.getState().landingOrderForm.isBorrowedCollateral).toEqual(
            true
        );
        await waitFor(() => {
            fireEvent.click(checkbox);
        });
        expect(store.getState().landingOrderForm.isBorrowedCollateral).toEqual(
            false
        );
    });
});
