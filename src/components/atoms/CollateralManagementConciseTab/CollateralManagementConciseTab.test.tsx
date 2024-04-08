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
        expect(screen.getByText('0%')).toBeInTheDocument();
        expect(screen.getByTestId('collateral-progress-bar-track')).toHaveStyle(
            'width: calc(100% * 0)'
        );

        expect(screen.getByText('Liquidation Risk')).toBeInTheDocument();
        expect(screen.getByText('Low')).toBeInTheDocument();
        expect(screen.getByText('Low')).toHaveClass('text-progressBarStart');
        expect(screen.getByTestId('liquidation-progress-bar-tick')).toHaveStyle(
            'width: calc(100% * 0 + 4px )'
        );
        expect(screen.getAllByText('N/A')).toHaveLength(2);
    });

    it('should render zero collateral concise tab', () => {
        render(<ZeroCollateral />);
        expect(screen.getByText('Collateral Utilization')).toBeInTheDocument();
        expect(screen.getByText('0%')).toBeInTheDocument();
        expect(screen.getByTestId('collateral-progress-bar-track')).toHaveStyle(
            'width: calc(100% * 0)'
        );
        expect(screen.getByText('Available:')).toBeInTheDocument();
        expect(screen.getByText('$0.00')).toBeInTheDocument();

        expect(screen.getByText('Liquidation Risk')).toBeInTheDocument();
        expect(screen.getByText('Low')).toBeInTheDocument();
        expect(screen.getByText('Low')).toHaveClass('text-progressBarStart');
        expect(screen.getByTestId('liquidation-progress-bar-tick')).toHaveStyle(
            'width: calc(100% * 0 + 4px )'
        );
        expect(screen.getByText('Threshold: 80%')).toBeInTheDocument();
    });

    it('should render collateral deposited zero coverage concise tab', () => {
        render(<CollateralDepositedZeroCoverage />);
        expect(screen.getByText('Collateral Utilization')).toBeInTheDocument();
        expect(screen.getByText('0%')).toBeInTheDocument();
        expect(screen.getByTestId('collateral-progress-bar-track')).toHaveStyle(
            'width: calc(100% * 0)'
        );
        expect(screen.getByText('Available:')).toBeInTheDocument();
        expect(screen.getByText('$80.00')).toBeInTheDocument();

        expect(screen.getByText('Liquidation Risk')).toBeInTheDocument();
        expect(screen.getByText('Low')).toBeInTheDocument();
        expect(screen.getByText('Low')).toHaveClass('text-progressBarStart');
        expect(screen.getByTestId('liquidation-progress-bar-tick')).toHaveStyle(
            'width: calc(100% * 0 + 4px )'
        );
        expect(screen.getByText('Threshold: 80%')).toBeInTheDocument();
    });

    it('should render CollateralManagementConciseTab', () => {
        render(<CollateralDepositedWithCoverage />);
        expect(screen.getByText('Collateral Utilization')).toBeInTheDocument();
        expect(screen.getByText('37%')).toBeInTheDocument();
        expect(screen.getByTestId('collateral-progress-bar-track')).toHaveStyle(
            'width: calc(100% * 0.37)'
        );
        expect(screen.getByText('Available:')).toBeInTheDocument();
        expect(screen.getByText('$43.00')).toBeInTheDocument();

        expect(screen.getByText('Liquidation Risk')).toBeInTheDocument();
        expect(screen.getByText('Low')).toBeInTheDocument();
        expect(screen.getByText('Low')).toHaveClass('text-progressBarStart');
        expect(screen.getByText('Threshold: 43%')).toBeInTheDocument();
        expect(screen.getByTestId('liquidation-progress-bar-tick')).toHaveStyle(
            'width: calc(100% * 0.37 + 4px )'
        );
    });

    it('should render correct color and risk status', () => {
        render(<CollateralDepositedWithCoverage collateralCoverage={0} />);
        expect(screen.getByText('Threshold: 80%')).toBeInTheDocument();
        expect(screen.getByText('Low')).toBeInTheDocument();
        expect(screen.getByText('Low')).toHaveClass('text-progressBarStart');

        render(<CollateralDepositedWithCoverage collateralCoverage={50} />);
        expect(screen.getByText('Threshold: 30%')).toBeInTheDocument();
        expect(screen.getByText('Medium')).toBeInTheDocument();
        expect(screen.getByText('Medium')).toHaveClass('text-progressBarVia');

        render(<CollateralDepositedWithCoverage collateralCoverage={90} />);
        expect(screen.getByText('Threshold: 0%')).toBeInTheDocument();
        expect(screen.getByText('High')).toBeInTheDocument();
        expect(screen.getByText('High')).toHaveClass('text-progressBarEnd');
    });
});
