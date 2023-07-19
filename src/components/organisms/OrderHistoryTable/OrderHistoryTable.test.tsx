import { composeStories } from '@storybook/react';
import { render, screen, fireEvent, waitFor, act } from 'src/test-utils.js';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import * as stories from './OrderHistoryTable.stories';

const { Default, WithPagination } = composeStories(stories);
const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

describe('OrderHistoryTable Component', () => {
    it('should render a Order History Table', () => {
        render(<Default />);
        expect(screen.getAllByTestId('order-history-table-row')).toHaveLength(
            11
        );
    });

    it('should open etherscan link', () => {
        window.open = jest.fn();
        render(<Default />);
        const rows = screen.getAllByTestId('order-history-table-row');
        const actionButton = rows[0].querySelectorAll('button')[0];
        fireEvent.click(actionButton);
        const etherscanButton = rows[0].querySelectorAll('button')[1];
        fireEvent.click(etherscanButton);
        expect(window.open).toHaveBeenCalledWith(
            'https://sepolia.etherscan.io/tx/0x6861736800000000000000000000000000000000000000000000000000000000',
            '_blank'
        );
    });

    it('should load more data when scrolled if pagination is available', async () => {
        await waitFor(() => render(<WithPagination />));
        expect(screen.getAllByTestId('order-history-table-row')).toHaveLength(
            20
        );
        await act(async () => {
            fireEvent.scroll(window, { target: { scrollTop: 100 } });
        });

        await waitFor(() => {
            expect(screen.getByText('Loading...')).toBeInTheDocument();
            expect(
                screen.getAllByTestId('order-history-table-row')
            ).toHaveLength(40);
        });
    });

    it('should not load more data when scrolled if pagination is not available', async () => {
        await waitFor(() => render(<Default />));
        expect(screen.getAllByTestId('order-history-table-row')).toHaveLength(
            11
        );
        await act(async () => {
            fireEvent.scroll(window, { target: { scrollTop: 100 } });
        });

        await waitFor(() => {
            expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
            expect(
                screen.queryAllByTestId('order-history-table-row')
            ).toHaveLength(11);
        });
    });

    it('should not load more data when scrolled if pagination is available but totalData is equal to length of data', async () => {
        const getMoreData = jest.fn();
        await waitFor(() =>
            render(
                <Default
                    pagination={{
                        totalData: 11,
                        getMoreData: getMoreData,
                        containerHeight: false,
                    }}
                />
            )
        );
        expect(screen.getAllByTestId('order-history-table-row')).toHaveLength(
            11
        );
        await act(async () => {
            fireEvent.scroll(window, { target: { scrollTop: 100 } });
        });

        await waitFor(() => {
            expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
            expect(getMoreData).not.toBeCalled();
            expect(
                screen.getAllByTestId('order-history-table-row')
            ).toHaveLength(11);
        });
    });
});
