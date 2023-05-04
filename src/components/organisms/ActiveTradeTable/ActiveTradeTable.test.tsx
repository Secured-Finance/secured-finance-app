import { composeStories } from '@storybook/testing-react';
import { fireEvent, render, screen, waitFor } from 'src/test-utils.js';
import timemachine from 'timemachine';
import * as stories from './ActiveTradeTable.stories';

const { Default } = composeStories(stories);

beforeAll(() => {
    timemachine.reset();
    timemachine.config({
        dateString: '2022-02-01T15:00:00.00Z',
    });
});

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
        expect(initialRows[5]).toHaveTextContent('Lend');
        screen.getByText('Type').click();
        const sortedRowsAsc = screen.getAllByRole('row');
        expect(sortedRowsAsc[1]).toHaveTextContent('Lend');
        expect(sortedRowsAsc[2]).toHaveTextContent('Lend');
        expect(sortedRowsAsc[3]).toHaveTextContent('Borrow');
        expect(sortedRowsAsc[4]).toHaveTextContent('Borrow');
        expect(sortedRowsAsc[5]).toHaveTextContent('Borrow');
        screen.getByText('Type').click();
        const sortedRowsDesc = screen.getAllByRole('row');
        expect(sortedRowsDesc[1]).toHaveTextContent('Borrow');
        expect(sortedRowsDesc[2]).toHaveTextContent('Borrow');
        expect(sortedRowsDesc[3]).toHaveTextContent('Borrow');
        expect(sortedRowsDesc[4]).toHaveTextContent('Lend');
        expect(sortedRowsDesc[5]).toHaveTextContent('Lend');
    });

    it('should display more options when clicking on the ... button', () => {
        render(<Default />);
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
        const moreOptionsButton = screen.getAllByRole('button', {
            name: 'More options',
        });
        expect(moreOptionsButton).toHaveLength(5);
        fireEvent.click(moreOptionsButton[0]);
        expect(screen.getByRole('menu')).toBeInTheDocument();
        expect(screen.getByText('View Contract')).toBeInTheDocument();
        expect(screen.getByText('Add/Reduce Position')).toBeInTheDocument();
        expect(screen.getByText('Unwind Position')).toBeInTheDocument();
    });

    it('should display the unwind dialog when clicking on the Unwind Position button', () => {
        render(<Default />);
        expect(screen.queryByText('Unwind Position')).not.toBeInTheDocument();
        const moreOptionsButton = screen.getAllByRole('button', {
            name: 'More options',
        });
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        fireEvent.click(moreOptionsButton[0]);
        fireEvent.click(screen.getByText('Unwind Position'));
        expect(screen.getByRole('dialog')).toBeInTheDocument();
    });

    it('should display hours and minutes when maturity is less than 24 hours', async () => {
        render(<Default />);
        const closeToMaturityRow = screen.getAllByRole('row')[5];
        expect(closeToMaturityRow).toHaveTextContent('Feb 2, 2022');
        waitFor(() => {
            expect(closeToMaturityRow).toHaveTextContent('21h-59m');
        });
    });
});
