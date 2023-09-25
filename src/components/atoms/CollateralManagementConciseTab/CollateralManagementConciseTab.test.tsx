import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './CollateralManagementConciseTab.stories';

const { Default } = composeStories(stories);

describe('CollateralManagementConciseTab component', () => {
    it('should render CollateralManagementConciseTab', () => {
        render(<Default />);
        expect(screen.getByText('Collateral Utilization')).toBeInTheDocument();
        expect(screen.getByText('37%')).toBeInTheDocument();
        expect(screen.getByTestId('collateral-progress-bar-track')).toHaveStyle(
            'width: calc(100% * 0.37)'
        );
        expect(screen.getByText('Available: $43.00')).toBeInTheDocument();

        expect(screen.getByText('Liquidation Risk')).toBeInTheDocument();
        expect(screen.getByText('Low')).toBeInTheDocument();
        expect(screen.getByText('Low')).toHaveClass('text-progressBarStart');
        expect(screen.getByText('Threshold: 43%')).toBeInTheDocument();
        expect(screen.getByTestId('liquidation-progress-bar-tick')).toHaveStyle(
            'width: calc(100% * 0.37 + 4px )'
        );
    });

    it('should render correct color and risk status', () => {
        render(<Default collateralCoverage={30} />);
        expect(screen.getByText('Threshold: 50%')).toBeInTheDocument();
        expect(screen.getByText('Low')).toBeInTheDocument();
        expect(screen.getByText('Low')).toHaveClass('text-progressBarStart');

        render(<Default collateralCoverage={50} />);
        expect(screen.getByText('Threshold: 30%')).toBeInTheDocument();
        expect(screen.getByText('Medium')).toBeInTheDocument();
        expect(screen.getByText('Medium')).toHaveClass('text-progressBarVia');

        render(<Default collateralCoverage={90} />);
        expect(screen.getByText('Threshold: 0%')).toBeInTheDocument();
        expect(screen.getByText('High')).toBeInTheDocument();
        expect(screen.getByText('High')).toHaveClass('text-progressBarEnd');
    });
});
