import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './StatsBar.stories';

const { Default } = composeStories(stories);

describe('test Stats Bar Component', () => {
    it('should render Stats Bar', () => {
        render(<Default />);
    });

    it('should display one grid with 4 tabs', () => {
        render(<Default />);
        expect(screen.getByRole('grid')).toBeInTheDocument();
        const tabs = screen.getAllByRole('gridcell');
        expect(tabs.length).toBe(4);
    });
});
