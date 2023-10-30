import { composeStories } from '@storybook/react';
import { fireEvent, render, screen, waitFor } from 'src/test-utils.js';
import * as stories from './CoreTable.stories';

const { Default, WithHiddenColumn, NonResponsive, WithPagination } =
    composeStories(stories);

describe('CoreTable Component', () => {
    it('should render a CoreTable', () => {
        render(<Default />);
    });

    it('should render a CoreTable with 20 rows and a header row', () => {
        render(<Default />);
        expect(screen.getAllByRole('row').length).toBe(21);
        expect(screen.getAllByTestId('core-table-row').length).toBe(20);
        expect(screen.getAllByTestId('core-table-header').length).toBe(1);
    });

    it('should have the row clickable if hoverRow returns true', () => {
        render(<Default options={{ hoverRow: () => true }} />);
        screen.getAllByTestId('core-table-row').forEach(row => {
            expect(row).toHaveClass('cursor-pointer');
        });
    });

    it('should have the row not clickable if hoverRow returns false', () => {
        render(<Default options={{ hoverRow: () => false }} />);
        screen.getAllByTestId('core-table-row').forEach(row => {
            expect(row).not.toHaveClass('cursor-pointer');
        });
    });

    it('should have borders for each row except the last if border is true', () => {
        render(<Default options={{ border: true }} />);
        const rows = screen.getAllByTestId('core-table-row');
        rows.forEach((row, index) => {
            if (index !== rows.length - 1) {
                expect(row).toHaveClass('border-b border-white-10');
            } else {
                expect(row).not.toHaveClass('border-b border-white-10');
            }
        });
    });

    it('should call onLineClick when a row is clicked and row is clickable', () => {
        const onLineClick = jest.fn();
        render(<Default options={{ onLineClick, hoverRow: () => true }} />);
        const row = screen.getAllByTestId('core-table-row')[0];
        fireEvent.click(row);
        expect(onLineClick).toBeCalledWith('0');
    });

    it('should not call onLineClick when an empty row is clicked', () => {
        const onLineClick = jest.fn();
        render(<Default options={{ onLineClick, hoverRow: () => false }} />);
        const row = screen.getAllByTestId('core-table-row')[0];
        fireEvent.click(row);
        expect(onLineClick).not.toBeCalled();
    });

    it('should hide a column if we pass a column id in the hiddenColumns prop', () => {
        render(<WithHiddenColumn />);
        const header = screen.getAllByTestId('core-table-header')[0];
        expect(header).not.toHaveTextContent('age');
        expect(header).toHaveTextContent('name');
    });

    it('should have a sticky column and background-color if responsive is true', () => {
        render(
            <Default
                options={{ responsive: true, stickyColumns: new Set([5]) }}
            />
        );
        const header = screen.getAllByTestId('core-table-header-cell')[5];
        expect(header).toHaveClass('sticky');
        expect(header).toHaveClass('bg-gunMetal/100');
    });

    it('should have not a sticky column if responsive is true', () => {
        render(<NonResponsive />);
        const header = screen.getAllByTestId('core-table-header-cell')[5];
        expect(header).not.toHaveClass('sticky');
        expect(header).not.toHaveClass('bg-gunMetal/100');
    });

    it('should not load more data when scrolled if getMoreData function is not available', async () => {
        render(<Default />);
        expect(screen.getAllByTestId('core-table-row')).toHaveLength(20);
        await waitFor(async () => {
            fireEvent.scroll(window, { target: { scrollY: 100 } });
            expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
        });
        await waitFor(async () => {
            expect(screen.getAllByTestId('core-table-row')).toHaveLength(20);
        });
    });

    it('should load more data when scrolled if getMoreData function is available', async () => {
        await waitFor(() => render(<WithPagination />));
        expect(screen.getAllByTestId('core-table-row')).toHaveLength(20);
        await waitFor(async () => {
            fireEvent.scroll(window, { target: { scrollTop: 100 } });
        });

        await waitFor(() => {
            expect(screen.getByText('Loading...')).toBeInTheDocument();
            expect(screen.getAllByTestId('core-table-row')).toHaveLength(40);
        });
    });

    it('should not load more data when scrolled if getMoreData function is available but totalData is equal to length of data', async () => {
        const getMoreData = jest.fn();
        await waitFor(() =>
            render(
                <Default
                    options={{
                        pagination: {
                            totalData: 20,
                            getMoreData: getMoreData,
                            containerHeight: false,
                        },
                    }}
                />
            )
        );
        expect(screen.getAllByTestId('core-table-row')).toHaveLength(20);
        await waitFor(async () => {
            fireEvent.scroll(window, { target: { scrollTop: 100 } });
        });

        await waitFor(() => {
            expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
            expect(getMoreData).not.toBeCalled();
            expect(screen.getAllByTestId('core-table-row')).toHaveLength(20);
        });
    });

    it('should not show the headers if showHeaders is false', () => {
        render(<Default options={{ showHeaders: false }} />);
        expect(
            screen.queryByTestId('core-table-header')
        ).not.toBeInTheDocument();
    });
});
