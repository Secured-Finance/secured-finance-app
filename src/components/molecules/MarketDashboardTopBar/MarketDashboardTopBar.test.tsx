import { composeStories } from '@storybook/testing-react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './MarketDashboardTopBar.stories';

const { Default, Values } = composeStories(stories);

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
        expect(screen.getAllByText('0')).toHaveLength(4);
    });

    it('should render the values on the MarketDashboardTopBar', () => {
        render(<Values />);

        expect(screen.getByText('26.16')).toBeInTheDocument();
        expect(screen.getByText('24.2')).toBeInTheDocument();
        expect(screen.getByText('894')).toBeInTheDocument();
        expect(screen.getByText('10,000,000')).toBeInTheDocument();
    });
});
