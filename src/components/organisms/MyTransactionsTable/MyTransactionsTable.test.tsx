import { composeStories } from '@storybook/testing-react';
import { act, fireEvent, render, waitFor, screen } from 'src/test-utils.js';
import * as stories from './MyTransactionsTable.stories';

const { Default, WithPagination } = composeStories(stories);

describe('MyTransactionsTable Component', () => {
    it('should render a MyTransactionsTable', () => {
        render(<Default />);
    });

    it('should load more data when scrolled if getMoreData function is available', async () => {
        await waitFor(() => render(<WithPagination />));
        expect(screen.getAllByText('1,000')).toHaveLength(20);
        await act(async () => {
            fireEvent.scroll(window, { target: { scrollTop: 100 } });
        });

        await waitFor(() => {
            expect(screen.getByText('Loading...')).toBeInTheDocument();
            expect(screen.getAllByText('1,000')).toHaveLength(40);
        });
    });
});
