import { composeStories } from '@storybook/testing-react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './MarketDashboardTable.stories';

const { Default } = composeStories(stories);

describe('test MarketDashboardComponent', () => {
    it('should render Market Dashboard Table', () => {
        render(<Default />);
    });

    it('should display one grid with 4 tabs', () => {
        render(<Default />);
        expect(screen.getByRole('grid')).toBeInTheDocument();
        const tabs = screen.getAllByRole('gridcell');
        expect(tabs.length).toBe(4);
    });
});
