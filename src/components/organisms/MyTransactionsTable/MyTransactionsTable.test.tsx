import { composeStories } from '@storybook/react';
import { fireEvent, render, waitFor, screen } from 'src/test-utils.js';
import * as stories from './MyTransactionsTable.stories';

const { Default, WithPagination } = composeStories(stories);

describe('MyTransactionsTable Component', () => {
    it('should render a MyTransactionsTable', () => {
        render(<Default />);
    });

    it('should load more data when scrolled if pagination is available', async () => {
        await waitFor(() => render(<WithPagination />));
        expect(screen.getAllByTestId('my-transactions-table-row')).toHaveLength(
            20
        );
        await waitFor(async () => {
            fireEvent.scroll(window, { target: { scrollTop: 100 } });
        });

        await waitFor(() => {
            expect(screen.getByText('Loading...')).toBeInTheDocument();
            expect(
                screen.getAllByTestId('my-transactions-table-row')
            ).toHaveLength(40);
        });
    });

    it('should not load more data when scrolled if pagination is not available', async () => {
        await waitFor(() => render(<Default />));
        expect(screen.getAllByTestId('my-transactions-table-row')).toHaveLength(
            5
        );
        await waitFor(async () => {
            fireEvent.scroll(window, { target: { scrollTop: 100 } });
        });

        await waitFor(() => {
            expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
            expect(
                screen.queryAllByTestId('my-transactions-table-row')
            ).toHaveLength(5);
        });
    });

    it('should not load more data when scrolled if getMoreData function is available but totalData is equal to length of data', async () => {
        const getMoreData = jest.fn();
        await waitFor(() =>
            render(
                <Default
                    pagination={{
                        totalData: 5,
                        getMoreData: getMoreData,
                        containerHeight: false,
                    }}
                />
            )
        );
        expect(screen.getAllByTestId('my-transactions-table-row')).toHaveLength(
            5
        );
        await waitFor(async () => {
            fireEvent.scroll(window, { target: { scrollTop: 100 } });
        });

        await waitFor(() => {
            expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
            expect(getMoreData).not.toBeCalled();
            expect(
                screen.getAllByTestId('my-transactions-table-row')
            ).toHaveLength(5);
        });
    });
});
