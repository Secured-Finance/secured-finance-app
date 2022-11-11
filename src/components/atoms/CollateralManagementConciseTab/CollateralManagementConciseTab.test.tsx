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
        expect(screen.getByText('Threshold 23%')).toBeInTheDocument();
        expect(screen.getByText('Medium')).toBeInTheDocument();

        expect(screen.getByTestId('collateral-progress-bar-track')).toHaveStyle(
            'width: calc(100% * 0.7)'
        );
    });
});
