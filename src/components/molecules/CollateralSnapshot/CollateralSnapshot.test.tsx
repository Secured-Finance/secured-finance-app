import { composeStories } from '@storybook/react';
import { render, screen, within } from 'src/test-utils.js';
import * as stories from './CollateralSnapshot.stories';

const { Default } = composeStories(stories);

describe('CollateralSnapshot Component', () => {
    it('should render a CollateralSnapshot', () => {
        render(<Default />);
    });

    it('should order the currencies by their index', () => {
        render(<Default />);
        const currencyItems = screen.getAllByTestId('core-table-row');
        expect(within(currencyItems[0]).getByText('USDC')).toBeInTheDocument();
        expect(within(currencyItems[1]).getByText('ETH')).toBeInTheDocument();
        expect(within(currencyItems[2]).getByText('WBTC')).toBeInTheDocument();
    });
});
