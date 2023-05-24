import { composeStories } from '@storybook/testing-react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './HeaderTable.stories';

const { Default } = composeStories(stories);

describe('test Header Component', () => {
    it('should render Header Table', () => {
        render(<Default />);
    });

    it('should display one grid with 4 tabs', () => {
        render(<Default />);
        expect(screen.getByRole('grid')).toBeInTheDocument();
        const tabs = screen.getAllByRole('gridcell');
        expect(tabs.length).toBe(4);
    });
});
