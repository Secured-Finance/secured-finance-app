import { composeStories } from '@storybook/testing-react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './PortfolioManagementTable.stories';

const { Default } = composeStories(stories);

describe('test PortfolioManagementComponent', () => {
    it('should render Portfolio Tab', () => {
        render(<Default />);
    });

    it('should display one grid with  tabs', () => {
        render(<Default />);
        expect(screen.getByRole('grid')).toBeInTheDocument();
        const tabs = screen.getAllByRole('gridcell');
        expect(tabs.length).toBe(4);
    });
});
