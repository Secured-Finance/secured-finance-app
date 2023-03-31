import { composeStories } from '@storybook/testing-react';
import { dec22Fixture } from 'src/stories/mocks/fixtures';
import { render, screen } from 'src/test-utils.js';
import { LoanValue } from 'src/utils/entities';
import * as stories from './CollateralSimulationSection.stories';

const { Trade, Unwind } = composeStories(stories);

describe('CollateralSimulationSection Component', () => {
    it('should render a CollateralSimulationSection', () => {
        render(<Trade />);
    });

    it('should display the remaining to borrow and the collateral usage', () => {
        render(<Trade />);
        expect(screen.getByText('Borrow Remaining')).toBeInTheDocument();
        expect(screen.getByText('Collateral Usage')).toBeInTheDocument();
    });

    it('should reduce the collateral usage when the tradePosition is BORROW', () => {
        render(<Trade />);
        expect(screen.getByText('37% -> 36.36%')).toBeInTheDocument();
    });

    it('should display the APR when the tradeValue is provided', () => {
        render(
            <Trade
                tradeValue={LoanValue.fromPrice(9800, dec22Fixture.toNumber())}
            />
        );
        expect(screen.getByText('APR')).toBeInTheDocument();
    });

    it('should not display the APR for an unwind', () => {
        render(<Unwind />);
        expect(screen.queryByText('APR')).not.toBeInTheDocument();
    });
});
