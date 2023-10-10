import { composeStories } from '@storybook/react';
import { fireEvent, render, screen } from 'src/test-utils.js';
import * as stories from './CollateralProgressBar.stories';

const {
    NotConnectedToWallet,
    ZeroCollateral,
    CollateralDepositedZeroCoverage,
    CollateralDepositedWithCoverage,
} = composeStories(stories);

describe('CollateralProgressBar Component', () => {
    it('should render not connected to wallet CollateralProgressBar', () => {
        render(<NotConnectedToWallet />);

        expect(screen.getByText('Collateral Utilization')).toBeInTheDocument();
        expect(screen.getByText('0%')).toBeInTheDocument();
        expect(screen.getByText('N/A')).toBeInTheDocument();

        expect(screen.getByTestId('collateral-progress-bar-tick')).toHaveStyle(
            'width: calc(100% * 0 + 4px )'
        );
        expect(screen.getByTestId('collateral-progress-bar-track')).toHaveStyle(
            'width: calc(100% * 0)'
        );
    });

    it('should render zero collateral CollateralProgressBar', () => {
        render(<ZeroCollateral />);
        expect(screen.getByText('Collateral Utilization')).toBeInTheDocument();
        expect(screen.getByText('0%')).toBeInTheDocument();
        expect(screen.getByText('$0.00')).toBeInTheDocument();
        expect(screen.getByText('of $0.00 available')).toBeInTheDocument();
        expect(screen.queryByText('N/A')).not.toBeInTheDocument();

        expect(screen.getByTestId('collateral-progress-bar-tick')).toHaveStyle(
            'width: calc(100% * 0 + 4px )'
        );
        expect(screen.getByTestId('collateral-progress-bar-track')).toHaveStyle(
            'width: calc(100% * 0)'
        );

        const information = screen.getByTestId('information-circle');
        fireEvent.mouseEnter(information);

        const tooltip = screen.getByRole('tooltip');

        expect(tooltip).toHaveTextContent(
            'Your current collateral balance is $0. Deposit collateral assets to borrow on Secured Finance.'
        );
    });

    it('should render collateral deposited zero coverage CollateralProgressBar', () => {
        render(<CollateralDepositedZeroCoverage />);
        expect(screen.getByText('Collateral Utilization')).toBeInTheDocument();
        expect(screen.getByText('0%')).toBeInTheDocument();
        expect(screen.getByText('$80.00')).toBeInTheDocument();
        expect(screen.getByText('of $100.00 available')).toBeInTheDocument();
        expect(screen.queryByText('N/A')).not.toBeInTheDocument();

        expect(screen.getByTestId('collateral-progress-bar-tick')).toHaveStyle(
            'width: calc(100% * 0 + 4px )'
        );
        expect(screen.getByTestId('collateral-progress-bar-track')).toHaveStyle(
            'width: calc(100% * 0)'
        );

        const information = screen.getByTestId('information-circle');
        fireEvent.mouseEnter(information);

        const tooltip = screen.getByRole('tooltip');

        expect(tooltip).toHaveTextContent(
            'Your current borrow limit is at $80.00 which is 80% of your $100.00 collateral deposit.Increasing collateral deposit will increase your borrow limit by 80% of its value.'
        );
    });

    it('should render collateral deposited with coverage CollateralProgressBar', () => {
        render(<CollateralDepositedWithCoverage />);
        expect(screen.getByText('Collateral Utilization')).toBeInTheDocument();
        expect(screen.getByText('37%')).toBeInTheDocument();
        expect(screen.getByText('$43.00')).toBeInTheDocument();
        expect(screen.getByText('of $100.00 available')).toBeInTheDocument();
        expect(screen.queryByText('N/A')).not.toBeInTheDocument();

        expect(screen.getByTestId('collateral-progress-bar-tick')).toHaveStyle(
            'width: calc(100% * 0.37 + 4px )'
        );
        expect(screen.getByTestId('collateral-progress-bar-track')).toHaveStyle(
            'width: calc(100% * 0.37)'
        );

        const information = screen.getByTestId('information-circle');
        fireEvent.mouseEnter(information);

        const tooltip = screen.getByRole('tooltip');

        expect(tooltip).toHaveTextContent(
            'Your current borrow limit is at $43.00 which is 43% of your $100.00 collateral deposit.Increasing collateral deposit will increase your borrow limit by 80% of its value.'
        );
    });
});
