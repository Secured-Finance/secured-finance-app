import { OrderSide } from '@secured-finance/sf-client';
import { composeStories } from '@storybook/react';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { render, screen, waitFor } from 'src/test-utils.js';
import * as stories from './CollateralSimulationSection.stories';

const { Trade } = composeStories(stories);

const mockSecuredFinance = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mockSecuredFinance);

describe('CollateralSimulationSection Component', () => {
    it('should render a CollateralSimulationSection', () => {
        render(<Trade />);
    });

    it('should display the borrow remaining and the collateral usage if its a BORROW order', async () => {
        render(<Trade side={OrderSide.BORROW} />);
        expect(screen.getByText('Borrow Amount')).toBeInTheDocument();
        expect(screen.getByText('50 WFIL')).toBeInTheDocument();

        await waitFor(() => {
            expect(screen.getByText('Borrow Remaining')).toBeInTheDocument();
            expect(screen.getByText('$9,135.50')).toBeInTheDocument();
        });

        expect(screen.getByText('Collateral Usage')).toBeInTheDocument();
        expect(screen.getByText('Bond Price')).toBeInTheDocument();
        expect(screen.getByText('~ 98.00')).toBeInTheDocument();
    });

    it('should not display the borrow remaining and the collateral usage if its a LEND order', () => {
        render(<Trade side={OrderSide.LEND} />);
        expect(screen.getByText('Lend Amount')).toBeInTheDocument();
        expect(screen.getByText('50 WFIL')).toBeInTheDocument();

        expect(screen.queryByText('Borrow Remaining')).not.toBeInTheDocument();
        expect(screen.queryByText('Collateral Usage')).not.toBeInTheDocument();

        expect(screen.getByText('Bond Price')).toBeInTheDocument();
        expect(screen.getByText('~ 98.00')).toBeInTheDocument();
    });

    it('should display the APR', () => {
        render(<Trade />);
        expect(screen.getByText('APR')).toBeInTheDocument();
        expect(screen.getByText('~ 2.04%')).toBeInTheDocument();
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
});
