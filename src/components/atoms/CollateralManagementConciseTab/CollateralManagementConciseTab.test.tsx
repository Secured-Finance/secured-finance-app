import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './CollateralManagementConciseTab.stories';

const {
    NotConnectedToWallet,
    ZeroCollateral,
    CollateralDepositedZeroCoverage,
    CollateralDepositedWithCoverage,
} = composeStories(stories);

describe('CollateralManagementConciseTab component', () => {
    it('should render not connected to wallet concise tab', () => {
        render(<NotConnectedToWallet />);
        expect(screen.getByText('Collateral Utilization')).toBeInTheDocument();
        expect(screen.getByTestId('collateral-progress-bar-track')).toHaveStyle(
            'width: calc(100% * 0)'
        );

        expect(screen.getByText('Liquidation Risk')).toBeInTheDocument();
        expect(screen.getByTestId('liquidation-progress-bar-tick')).toHaveStyle(
            'width: calc(100% * 0 + 4px )'
        );
        expect(screen.getAllByText('N/A')).toHaveLength(2);
    });

    it('should render zero collateral concise tab', async () => {
        render(<ZeroCollateral />);

        expect(screen.getByText('Collateral Utilization')).toBeInTheDocument();
        expect(screen.getByText('0%')).toBeInTheDocument();
        expect(screen.getByTestId('collateral-progress-bar-track')).toHaveStyle(
            'width: calc(100% * 0)'
        );
        expect(screen.getByText('$0.00')).toBeInTheDocument();
        expect(screen.getByText('of $100.00 available')).toBeInTheDocument();

        expect(screen.getByText('Liquidation Risk')).toBeInTheDocument();
        expect(screen.getByText('Safe')).toBeInTheDocument();
        expect(screen.getByText('Safe')).toHaveClass('text-primary-300');
        expect(screen.getByTestId('liquidation-progress-bar-tick')).toHaveStyle(
            'width: calc(100% * 0 + 4px )'
        );
        expect(screen.getByText('80%')).toBeInTheDocument();
    });

    it('should render collateral deposited zero coverage concise tab', async () => {
        render(<CollateralDepositedZeroCoverage />);

        expect(screen.getByText('Collateral Utilization')).toBeInTheDocument();
        expect(screen.getByText('0%')).toBeInTheDocument();
        expect(screen.getByTestId('collateral-progress-bar-track')).toHaveStyle(
            'width: calc(100% * 0)'
        );

        expect(screen.getByText('$80.00')).toBeInTheDocument();
        expect(screen.getByText('of $100.00 available')).toBeInTheDocument();

        expect(screen.getByText('Liquidation Risk')).toBeInTheDocument();
        expect(screen.getByText('Safe')).toBeInTheDocument();
        expect(screen.getByText('Safe')).toHaveClass('text-primary-300');

        expect(screen.getByTestId('liquidation-progress-bar-tick')).toHaveStyle(
            'width: calc(100% * 0 + 4px )'
        );
        expect(screen.getByText('80%')).toBeInTheDocument();
    });

    it('should render CollateralManagementConciseTab', async () => {
        render(<CollateralDepositedWithCoverage />);

        expect(screen.getByText('Collateral Utilization')).toBeInTheDocument();
        expect(screen.getByText('37%')).toBeInTheDocument();
        expect(screen.getByTestId('collateral-progress-bar-track')).toHaveStyle(
            'width: calc(100% * 0.37)'
        );
        expect(screen.getByText('$43.00')).toBeInTheDocument();
        expect(screen.getByText('of $100.00 available')).toBeInTheDocument();

        expect(screen.getByText('Liquidation Risk')).toBeInTheDocument();
        expect(screen.getByText('Low')).toBeInTheDocument();
        expect(screen.getByText('Low')).toHaveClass('text-secondary-500');
        expect(screen.getByText('43%')).toBeInTheDocument();
        expect(screen.getByTestId('liquidation-progress-bar-tick')).toHaveStyle(
            'width: calc(100% * 0.37 + 4px )'
        );
    });

    it('should render correct color and risk status', () => {
        render(<CollateralDepositedWithCoverage collateralCoverage={0} />);
        expect(screen.getByText('80%')).toBeInTheDocument();
        expect(screen.getByText('Safe')).toBeInTheDocument();
        expect(screen.getByText('Safe')).toHaveClass('text-primary-300');

        render(<CollateralDepositedWithCoverage collateralCoverage={50} />);
        expect(screen.getByText('30%')).toBeInTheDocument();
        expect(screen.getByText('Medium')).toBeInTheDocument();
        expect(screen.getByText('Medium')).toHaveClass('text-warning-500');

        render(<CollateralDepositedWithCoverage collateralCoverage={70} />);
        expect(screen.getByText('10%')).toBeInTheDocument();
        expect(screen.getByText('High')).toBeInTheDocument();
        expect(screen.getByText('High')).toHaveClass('text-error-300');
    });
});
