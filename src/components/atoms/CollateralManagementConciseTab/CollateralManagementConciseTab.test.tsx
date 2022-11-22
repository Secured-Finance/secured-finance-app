import { composeStories } from '@storybook/testing-react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './CollateralManagementConciseTab.stories';

const { Default } = composeStories(stories);

describe('CollateralManagementConciseTab component', () => {
    it('should render CollateralManagementConciseTab', () => {
        render(<Default />);
        expect(screen.getByText('Collateral')).toBeInTheDocument();
        expect(screen.getByText('Utilization 70%')).toBeInTheDocument();
        expect(screen.getByText('$70')).toBeInTheDocument();

        expect(screen.getByText('Liquidation Risk')).toBeInTheDocument();
        expect(screen.getByText('Threshold 10%')).toBeInTheDocument();
        expect(screen.getByText('High')).toBeInTheDocument();
        expect(screen.getByText('High')).toHaveClass('text-progressBarEnd');

        expect(screen.getByTestId('collateral-progress-bar-track')).toHaveStyle(
            'width: calc(100% * 0.7)'
        );
    });

    it('should render correct color and risk status', () => {
        render(<Default collateralCoverage={0} />);
        expect(screen.getByText('Threshold 80%')).toBeInTheDocument();
        expect(screen.getByText('N/A')).toBeInTheDocument();
        expect(screen.getByText('N/A')).toHaveClass('text-white');

        render(<Default collateralCoverage={30} />);
        expect(screen.getByText('Threshold 50%')).toBeInTheDocument();
        expect(screen.getByText('Low')).toBeInTheDocument();
        expect(screen.getByText('Low')).toHaveClass('text-progressBarStart');

        render(<Default collateralCoverage={50} />);
        expect(screen.getByText('Threshold 30%')).toBeInTheDocument();
        expect(screen.getByText('Medium')).toBeInTheDocument();
        expect(screen.getByText('Medium')).toHaveClass('text-progressBarVia');

        render(<Default collateralCoverage={90} />);
        expect(screen.getByText('Threshold 0%')).toBeInTheDocument();
        expect(screen.getByText('Liquidated')).toBeInTheDocument();
        expect(screen.getByText('Liquidated')).toHaveClass(
            'text-progressBarEnd'
        );
    });
});
