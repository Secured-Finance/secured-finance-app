import { composeStories } from '@storybook/testing-react';
import { fireEvent, render, screen } from 'src/test-utils.js';
import * as stories from './ActiveTradeTable.stories';

const { Default } = composeStories(stories);

describe('ActiveTradeTable Component', () => {
    it('should render a ActiveTradeTable as a table', () => {
        render(<Default />);
        expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('should sort the table by position', () => {
        render(<Default />);
        const initialRows = screen.getAllByRole('row');
        expect(initialRows[1]).toHaveTextContent('Lend');
        expect(initialRows[2]).toHaveTextContent('Borrow');
        expect(initialRows[3]).toHaveTextContent('Borrow');
        expect(initialRows[4]).toHaveTextContent('Borrow');
        screen.getByText('Type').click();
        const sortedRowsAsc = screen.getAllByRole('row');
        expect(sortedRowsAsc[1]).toHaveTextContent('Lend');
        expect(sortedRowsAsc[2]).toHaveTextContent('Borrow');
        expect(sortedRowsAsc[3]).toHaveTextContent('Borrow');
        expect(sortedRowsAsc[4]).toHaveTextContent('Borrow');
        screen.getByText('Type').click();
        const sortedRowsDesc = screen.getAllByRole('row');
        expect(sortedRowsDesc[1]).toHaveTextContent('Borrow');
        expect(sortedRowsDesc[2]).toHaveTextContent('Borrow');
        expect(sortedRowsDesc[3]).toHaveTextContent('Borrow');
        expect(sortedRowsDesc[4]).toHaveTextContent('Lend');
    });

    it('should display more options when clicking on the ... button', () => {
        render(<Default />);
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
        const moreOptionsButton = screen.getAllByRole('button', {
            name: 'More options',
        });
        expect(moreOptionsButton).toHaveLength(4);
        fireEvent.click(moreOptionsButton[0]);
        expect(screen.getByRole('menu')).toBeInTheDocument();
        expect(screen.getByText('View Contract')).toBeInTheDocument();
        expect(screen.getByText('Add/Reduce Position')).toBeInTheDocument();
        expect(screen.getByText('Unwind Position')).toBeInTheDocument();
    });
});
