import { composeStories } from '@storybook/testing-react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './CollateralTabRightPane.stories';

const { Default } = composeStories(stories);

describe('CollateralTabRightPane component', () => {
    it('should render CollateralTabRightPane', () => {
        render(<Default />);
        expect(
            screen.getByTestId('collateral-progress-bar')
        ).toBeInTheDocument();
        expect(
            screen.getByTestId('liquidation-progress-bar')
        ).toBeInTheDocument();

        expect(screen.getByText('Collateral Utilization')).toBeInTheDocument();
        expect(screen.getByText('Liquidation Risk')).toBeInTheDocument();
        expect(screen.getAllByText('N/A')).toHaveLength(4);
    });

    it('should render the progress bars with appropriate values', () => {
        render(<Default />);
        expect(screen.getByText('Collateral Utilization')).toBeInTheDocument();
        expect(screen.getByText('$37.00')).toBeInTheDocument();
        expect(screen.getByText('of $74.00 available')).toBeInTheDocument();
        expect(screen.getByText('50%')).toBeInTheDocument();

        expect(screen.getByText('Liquidation Risk')).toBeInTheDocument();
        expect(screen.getAllByText('N/A')).toHaveLength(2);
    });
});
