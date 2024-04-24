import { composeStories } from '@storybook/react';
import { fireEvent, render, screen } from 'src/test-utils.js';
import * as stories from './LiquidationProgressBar.stories';

const { NotConnectedToWallet, CollateralDepositedWithCoverage } =
    composeStories(stories);

describe('LiquidationProgressBar Component', () => {
    it('should render a default LiquidationProgressBar', () => {
        render(<NotConnectedToWallet />);

        expect(screen.getByText('Liquidation Risk')).toBeInTheDocument();
        expect(screen.getByText('Safe')).toBeInTheDocument();
        expect(screen.getByText('Safe')).toHaveClass('text-primary-300');

        expect(screen.getByText('N/A')).toBeInTheDocument();

        expect(screen.getByTestId('liquidation-progress-bar-tick')).toHaveStyle(
            'width: calc(100% * 0 + 4px )'
        );
    });

    it('should render a LiquidationProgressBar with values', () => {
        render(<CollateralDepositedWithCoverage />);

        expect(screen.getByText('Liquidation Risk')).toBeInTheDocument();
        expect(screen.getByText('Medium')).toBeInTheDocument();
        expect(screen.getByText('Medium')).toHaveClass('text-warning-500');

        expect(screen.getByText('35%')).toBeInTheDocument();
        expect(screen.getByText('35%')).toHaveClass('text-warning-500');

        expect(
            screen.getByText('threshold to liquidation')
        ).toBeInTheDocument();
        expect(screen.queryByText('N/A')).not.toBeInTheDocument();

        expect(screen.getByTestId('liquidation-progress-bar-tick')).toHaveStyle(
            'width: calc(100% * 0.5625 + 4px )'
        );

        const information = screen.getByTestId('information-circle');
        fireEvent.mouseEnter(information);

        const tooltip = screen.getByRole('tooltip');

        expect(tooltip).toHaveTextContent(
            'Liquidation threshold is the limit where your collateral will be eligible for liquidation.You are currently 35% under the liquidation threshold (80% of deposit balance).'
        );
    });

    it('should render correct color and risk status', () => {
        render(<CollateralDepositedWithCoverage liquidationPercentage={30} />);
        expect(screen.getByText('50%')).toBeInTheDocument();
        expect(screen.getByText('50%')).toHaveClass('text-secondary-500');

        expect(screen.getByText('Low')).toBeInTheDocument();
        expect(screen.getByText('Low')).toHaveClass('text-secondary-500');

        render(<CollateralDepositedWithCoverage liquidationPercentage={50} />);
        expect(screen.getByText('30%')).toBeInTheDocument();
        expect(screen.getByText('30%')).toHaveClass('text-warning-500');

        expect(screen.getByText('Medium')).toBeInTheDocument();
        expect(screen.getByText('Medium')).toHaveClass('text-warning-500');

        render(<CollateralDepositedWithCoverage liquidationPercentage={90} />);
        expect(screen.getByText('0%')).toBeInTheDocument();
        expect(screen.getByText('0%')).toHaveClass('text-error-500');
        expect(screen.getByText('Very High')).toBeInTheDocument();
        expect(screen.getByText('Very High')).toHaveClass('text-error-500');
    });
});
