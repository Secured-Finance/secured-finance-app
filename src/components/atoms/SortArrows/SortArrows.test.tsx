import { composeStories } from '@storybook/testing-react';
import { render } from 'src/test-utils.js';
import * as stories from './SortArrows.stories';

const { Default, Ascending, Descending } = composeStories(stories);

describe('SortArrows Component', () => {
    it('should render a SortArrows', () => {
        render(<Default />);
    });

    it('should render a the two arrows in gray', () => {
        render(<Default />);
        expect(
            document.querySelector('[data-testid="up-sort-arrows"]')
        ).toHaveClass('text-slateGray');
        expect(
            document.querySelector('[data-testid="down-sort-arrows"]')
        ).toHaveClass('text-slateGray');
    });

    it('should render a the up arrow in white when sorting is asc', () => {
        render(<Ascending />);
        expect(
            document.querySelector('[data-testid="up-sort-arrows"]')
        ).toHaveClass('text-white');
        expect(
            document.querySelector('[data-testid="down-sort-arrows"]')
        ).toHaveClass('text-slateGray');
    });

    it('should render a the down arrow in white when sorting is desc', () => {
        render(<Descending />);
        expect(
            document.querySelector('[data-testid="up-sort-arrows"]')
        ).toHaveClass('text-slateGray');
        expect(
            document.querySelector('[data-testid="down-sort-arrows"]')
        ).toHaveClass('text-white');
    });
});
