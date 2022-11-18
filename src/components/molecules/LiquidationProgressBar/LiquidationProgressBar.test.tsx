import { composeStories } from '@storybook/testing-react';
import { fireEvent, render, screen } from 'src/test-utils.js';
import * as stories from './LiquidationProgressBar.stories';

const { Default, ConnectedToWallet } = composeStories(stories);

describe('LiquidationProgressBar Component', () => {
    it('should render a default LiquidationProgressBar', () => {
        render(<Default />);

        expect(screen.getByText('Liquidation Risk')).toBeInTheDocument();
        expect(screen.getAllByText('N/A')).toHaveLength(2);

        expect(screen.getByTestId('liquidation-progress-bar-tick')).toHaveStyle(
            'width: calc(100% * 0 + 4px )'
        );
    });

    it('should render a LiquidationProgressBar with values', () => {
        render(<ConnectedToWallet />);

        expect(screen.getByText('Liquidation Risk')).toBeInTheDocument();
        expect(screen.getByText('40%')).toBeInTheDocument();
        expect(screen.getByText('40%')).toHaveClass('text-progressBarVia');
        expect(
            screen.getByText('threshold to liquidation')
        ).toBeInTheDocument();
        expect(screen.queryByText('Medium')).toBeInTheDocument();
        expect(screen.getByText('Medium')).toHaveClass('text-progressBarVia');

        expect(screen.getByTestId('liquidation-progress-bar-tick')).toHaveStyle(
            'width: calc(100% * 0.5 + 4px )'
        );

        const information = screen.getByTestId('information-circle');
        fireEvent.mouseEnter(information);

        expect(
            screen.getByText(
                'You are currently at 40% to liquidation. Upon reaching the liquidation threshold (80% LTV), 50% of assets will automatically be liquidated to repay the lender. Liquidation will be subject to 5% liquation fee.'
            )
        ).toBeInTheDocument();
    });

    it('should render correct color and risk status', () => {
        render(<Default liquidationPercentage={10} />);
        expect(screen.getByText('10%')).toBeInTheDocument();
        expect(screen.getByText('10%')).toHaveClass('text-progressBarStart');
        expect(screen.getByText('Low')).toBeInTheDocument();
        expect(screen.getByText('Low')).toHaveClass('text-progressBarStart');

        render(<Default liquidationPercentage={70} />);
        expect(screen.getByText('70%')).toBeInTheDocument();
        expect(screen.getByText('70%')).toHaveClass('text-progressBarEnd');
        expect(screen.getByText('High')).toBeInTheDocument();
        expect(screen.getByText('High')).toHaveClass('text-progressBarEnd');
    });
});
