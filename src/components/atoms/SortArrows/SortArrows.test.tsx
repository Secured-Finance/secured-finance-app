import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './SortArrows.stories';

const { Default, Ascending, Descending } = composeStories(stories);

describe('SortArrows Component', () => {
    it('should render a SortArrows', () => {
        render(<Default />);
    });

    it('should render a the two arrows in gray', () => {
        render(<Default />);
        expect(screen.getByTestId('up-sort-arrows')).toHaveClass(
            'text-neutral-400'
        );
        expect(screen.getByTestId('down-sort-arrows')).toHaveClass(
            'text-neutral-400'
        );
    });

    it('should render a the up arrow in white when sorting is asc', () => {
        render(<Ascending />);
        expect(screen.getByTestId('up-sort-arrows')).toHaveClass('text-white');
        expect(screen.getByTestId('down-sort-arrows')).toHaveClass(
            'text-neutral-400'
        );
    });

    it('should render a the down arrow in white when sorting is desc', () => {
        render(<Descending />);
        expect(screen.getByTestId('up-sort-arrows')).toHaveClass(
            'text-neutral-400'
        );
        expect(screen.getByTestId('down-sort-arrows')).toHaveClass(
            'text-white'
        );
    });
});
