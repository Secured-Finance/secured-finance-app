import { composeStories } from '@storybook/testing-react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './MarketDashboardTopBar.stories';

const { Default } = composeStories(stories);

describe('MarketDashboardTopBar Component', () => {
    it('should render a default MarketDashboardTopBar', () => {
        render(<Default />);

        expect(screen.getByText('FIL-SEP22')).toBeInTheDocument();
        expect(
            screen.getByText('Zero-coupon loan expires SEP22')
        ).toBeInTheDocument();

        expect(screen.getByText('24h High')).toBeInTheDocument();
        expect(screen.getByText('24h Low')).toBeInTheDocument();
        expect(screen.getByText('24h Trades')).toBeInTheDocument();
        expect(screen.getByText('24h Volume')).toBeInTheDocument();
    });
});
