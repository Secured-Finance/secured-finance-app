import { composeStories } from '@storybook/testing-react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './ActiveTradeTable.stories';

const { Default } = composeStories(stories);

describe('ActiveTradeTable Component', () => {
    it('should render a ActiveTradeTable as a table', () => {
        render(<Default />);
        expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('should render a ActiveTradeTable with 2 rows and a header row', () => {
        render(<Default />);
        expect(screen.getAllByRole('row')).toHaveLength(3);
    });

    it('should sort the table by position', () => {
        render(<Default />);
        const initialRows = screen.getAllByRole('row');
        expect(initialRows[1]).toHaveTextContent('Borrow');
        expect(initialRows[2]).toHaveTextContent('Lend');
        screen.getByText('Position').click();
        const sortedRowsAsc = screen.getAllByRole('row');
        expect(sortedRowsAsc[1]).toHaveTextContent('Borrow');
        expect(sortedRowsAsc[2]).toHaveTextContent('Lend');
        screen.getByText('Position').click();
        const sortedRowsDesc = screen.getAllByRole('row');
        expect(sortedRowsDesc[1]).toHaveTextContent('Lend');
        expect(sortedRowsDesc[2]).toHaveTextContent('Borrow');
    });
});
