import { composeStories } from '@storybook/react';
import { preloadedAssetPrices } from 'src/stories/mocks/fixtures';
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

    it('should display the borrow remaining and the collateral usage', async () => {
        render(<Trade />);

        await waitFor(() => {
            expect(screen.getByText('Borrow Remaining')).toBeInTheDocument();
            expect(screen.getByText('$4,903.14')).toBeInTheDocument();
        });
        expect(screen.getByText('Collateral Usage')).toBeInTheDocument();
        expect(screen.getByText('55%')).toBeInTheDocument();
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

    it('should display ZC usage', async () => {
        render(<Trade />, { preloadedState: preloadedAssetPrices });
        expect(screen.getByText('ZC Usage')).toBeInTheDocument();
        await waitFor(() => {
            expect(screen.getByText('0%')).toBeInTheDocument();
            expect(screen.getByText('1.44%')).toBeInTheDocument();
        });
    });
});
