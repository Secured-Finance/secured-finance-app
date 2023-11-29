import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import { CurrencySymbol } from 'src/utils';
import * as stories from './CollateralUsageSection.stories';

const { Default } = composeStories(stories);

describe('CollateralUsageSection Component', () => {
    it('should render a CollateralUsageSection', () => {
        render(<Default />);
    });

    it('should display the collateral usage from the prop', () => {
        render(<Default collateralCoverage={5000} />);
        expect(screen.getByText('Collateral Usage')).toBeInTheDocument();
        expect(screen.getByText('50%')).toBeInTheDocument();
    });

    it('should compute the available to borrow from the collateral', async () => {
        render(<Default />);

        expect(screen.getByText('Available to borrow')).toBeInTheDocument();
        const available = await screen.findByText('867.19 WFIL');
        expect(available).toBeInTheDocument();
    });

    it('should compute the available to borrow in the selected currency', async () => {
        render(
            <Default
                currency={CurrencySymbol.USDC}
                availableToBorrow={5203.154}
            />
        );

        expect(screen.getByText('Available to borrow')).toBeInTheDocument();
        const available = await screen.findByText('5,203.15 USDC');
        expect(available).toBeInTheDocument();
    });

    it('should render correct color on collateral usage', () => {
        render(<Default collateralCoverage={0} />);
        expect(screen.getByText('0%')).toBeInTheDocument();
        expect(screen.getByText('0%')).toHaveClass('text-progressBarStart');

        render(<Default collateralCoverage={1000} />);
        expect(screen.getByText('10%')).toBeInTheDocument();
        expect(screen.getByText('10%')).toHaveClass('text-progressBarStart');

        render(<Default collateralCoverage={5000} />);
        expect(screen.getByText('50%')).toBeInTheDocument();
        expect(screen.getByText('50%')).toHaveClass('text-progressBarVia');

        render(<Default collateralCoverage={9000} />);
        expect(screen.getByText('90%')).toBeInTheDocument();
        expect(screen.getByText('90%')).toHaveClass('text-progressBarEnd');
    });
});
