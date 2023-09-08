import { OrderSide } from '@secured-finance/sf-client';
import { composeStories } from '@storybook/react';
import { fireEvent, render, screen } from 'src/test-utils.js';
import { OrderType } from 'src/types';
import * as stories from './OrderBookWidget.stories';

const { Default, Loading } = composeStories(stories);

describe('OrderBookWidget Component', () => {
    it('should render a OrderBookWidget', () => {
        render(<Default />);
    });

    it('should render two tables', () => {
        render(<Default />);
        expect(screen.getByTestId('buyOrders')).toBeInTheDocument();
        expect(screen.getByTestId('sellOrders')).toBeInTheDocument();
    });

    describe('Mid Price', () => {
        it('should display the last mid price', () => {
            render(<Default />);
            expect(screen.getByTestId('last-mid-price')).toHaveTextContent(
                '93.00'
            );
        });

        it('should write the last mid price in the store', () => {
            const { store } = render(<Default />);
            expect(store.getState().analytics.midPrice).toBe(9300);
        });

        it('should display 0 as the last mid price if any of the orders is empty', () => {
            render(
                <Default
                    orderbook={{
                        data: { borrowOrderbook: [], lendOrderbook: [] },
                        isLoading: false,
                    }}
                />
            );
            expect(screen.getByTestId('last-mid-price')).toHaveTextContent('0');
        });

        it('should hide the mid price when hideMidPrice is true', () => {
            render(<Default hideMidPrice />);
            expect(
                screen.queryByTestId('last-mid-price')
            ).not.toBeInTheDocument();
        });
    });

    it('should update store when Sell order row is clicked', () => {
        const { store } = render(<Default />);
        const row = screen.getAllByTestId('sellOrders-row')[0];
        fireEvent.click(row);
        expect(store.getState().landingOrderForm.orderType).toEqual(
            OrderType.LIMIT
        );

        expect(store.getState().landingOrderForm.amount).toEqual(
            '43000000000000000000000'
        );

        expect(store.getState().landingOrderForm.unitPrice).toEqual(9200);

        expect(store.getState().landingOrderForm.side).toEqual(
            OrderSide.BORROW
        );
    });

    it('should update store when Lend order row is clicked', async () => {
        const { store } = render(<Default />);
        const row = screen.getAllByTestId('buyOrders-row')[5];
        fireEvent.click(row);

        expect(store.getState().landingOrderForm.orderType).toEqual(
            OrderType.LIMIT
        );

        expect(store.getState().landingOrderForm.amount).toEqual(
            '1800000000000000000000'
        );

        expect(store.getState().landingOrderForm.unitPrice).toEqual(9400);

        expect(store.getState().landingOrderForm.side).toEqual(OrderSide.LEND);
    });

    it('should display the spinner when loading', () => {
        render(<Loading />);
        expect(
            screen.getByRole('alertdialog', { name: 'Loading' })
        ).toBeInTheDocument();
    });

    describe('Visibility toggles', () => {
        const getButton = (name: string) =>
            screen.getByRole('button', { name });

        it('should render three toggle buttons', () => {
            render(<Default />);
            expect(getButton('showAll')).toBeInTheDocument();
            expect(getButton('showLendOrders')).toBeInTheDocument();
            expect(getButton('showBorrowOrders')).toBeInTheDocument();
        });

        it('should render the showAll button as active by default', () => {
            render(<Default />);
            expect(getButton('showAll')).toHaveClass('bg-universeBlue');
            expect(getButton('showLendOrders')).not.toHaveClass(
                'bg-universeBlue'
            );
            expect(getButton('showBorrowOrders')).not.toHaveClass(
                'bg-universeBlue'
            );
        });

        it('should toggle showBorrow state when Borrow button is clicked', () => {
            render(<Default />);
            expect(screen.getByTestId('buyOrders')).toBeInTheDocument();
            expect(screen.getByTestId('sellOrders')).toBeInTheDocument();
            fireEvent.click(getButton('showBorrowOrders'));
            expect(getButton('showAll')).not.toHaveClass('bg-universeBlue');
            expect(getButton('showLendOrders')).not.toHaveClass(
                'bg-universeBlue'
            );
            expect(getButton('showBorrowOrders')).toHaveClass(
                'bg-universeBlue'
            );
            expect(screen.getByTestId('buyOrders')).toBeInTheDocument();
            expect(screen.queryByTestId('sellOrders')).not.toBeInTheDocument();

            fireEvent.click(getButton('showBorrowOrders'));
            expect(getButton('showAll')).toHaveClass('bg-universeBlue');
            expect(getButton('showLendOrders')).not.toHaveClass(
                'bg-universeBlue'
            );
            expect(getButton('showBorrowOrders')).not.toHaveClass(
                'bg-universeBlue'
            );
            expect(screen.getByTestId('buyOrders')).toBeInTheDocument();
            expect(screen.getByTestId('sellOrders')).toBeInTheDocument();
        });

        it('should toggle showLend state when Lend button is clicked', () => {
            render(<Default />);
            expect(screen.getByTestId('buyOrders')).toBeInTheDocument();
            expect(screen.getByTestId('sellOrders')).toBeInTheDocument();

            fireEvent.click(getButton('showLendOrders'));
            expect(getButton('showAll')).not.toHaveClass('bg-universeBlue');
            expect(getButton('showLendOrders')).toHaveClass('bg-universeBlue');
            expect(getButton('showBorrowOrders')).not.toHaveClass(
                'bg-universeBlue'
            );
            expect(screen.queryByTestId('buyOrders')).not.toBeInTheDocument();
            expect(screen.getByTestId('sellOrders')).toBeInTheDocument();

            fireEvent.click(getButton('showLendOrders'));
            expect(getButton('showAll')).toHaveClass('bg-universeBlue');
            expect(getButton('showLendOrders')).not.toHaveClass(
                'bg-universeBlue'
            );
            expect(getButton('showBorrowOrders')).not.toHaveClass(
                'bg-universeBlue'
            );
            expect(screen.getByTestId('buyOrders')).toBeInTheDocument();
            expect(screen.getByTestId('sellOrders')).toBeInTheDocument();
        });

        it('should hide the mid price when showLendOrders is clicked and show it again when re clicked', () => {
            render(<Default />);
            expect(screen.getByTestId('last-mid-price')).toBeInTheDocument();
            fireEvent.click(getButton('showLendOrders'));
            expect(
                screen.queryByTestId('last-mid-price')
            ).not.toBeInTheDocument();
            fireEvent.click(getButton('showLendOrders'));
            expect(screen.getByTestId('last-mid-price')).toBeInTheDocument();
        });

        it('should never show the mid price if hideMidPrice is true', () => {
            render(<Default hideMidPrice />);
            expect(
                screen.queryByTestId('last-mid-price')
            ).not.toBeInTheDocument();
            fireEvent.click(getButton('showLendOrders'));
            expect(
                screen.queryByTestId('last-mid-price')
            ).not.toBeInTheDocument();
            fireEvent.click(getButton('showBorrowOrders'));
            expect(
                screen.queryByTestId('last-mid-price')
            ).not.toBeInTheDocument();
        });
    });

    describe('Orderbook data', () => {
        it('should display the correct number of rows', () => {
            render(<Default />);
            expect(screen.getAllByTestId('buyOrders-row')).toHaveLength(6);
            expect(screen.getAllByTestId('sellOrders-row')).toHaveLength(6);
        });

        it('should sort the rows by price', () => {
            render(<Default />);
            const buyRows = screen.getAllByTestId('buyOrders-row');
            const sellRows = screen.getAllByTestId('sellOrders-row');
            const buyPrices = buyRows.map(row => row.children[0].textContent);
            const sellPrices = sellRows.map(row => row.children[0].textContent);
            expect(buyPrices).toEqual([
                '\xa0', // this is a non-breaking space
                '98.50',
                '97.00',
                '95.00',
                '94.75',
                '94.00',
            ]);
            expect(sellPrices).toEqual([
                '92.00',
                '91.10',
                '90.50',
                '90.10',
                '89.80',
                '89.60',
            ]);
        });
    });

    describe('Orderbook data with aggregation', () => {
        it('should show a dropdown with the correct options', () => {
            render(<Default />);
            const dropdown = screen.getByRole('button', { name: '0.0001' });
            fireEvent.click(dropdown);
            const options = screen.getAllByRole('menuitem');
            expect(options).toHaveLength(4);
            expect(options[0]).toHaveTextContent('0.0001');
            expect(options[1]).toHaveTextContent('0.001');
            expect(options[2]).toHaveTextContent('0.01');
            expect(options[3]).toHaveTextContent('0.1');
        });
    });
});
