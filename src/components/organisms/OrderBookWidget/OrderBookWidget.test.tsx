import { composeStories } from '@storybook/react';
import { fireEvent, render, screen, within } from 'src/test-utils.js';
import { OrderType } from 'src/types';
import * as stories from './OrderBookWidget.stories';

const { Default, Loading, Itayose } = composeStories(stories);

describe('OrderBookWidget Component', () => {
    it('should render two tables', () => {
        render(<Default />);
        expect(screen.getByTestId('buyOrders')).toBeInTheDocument();
        expect(screen.getByTestId('sellOrders')).toBeInTheDocument();
    });

    describe('Mid Price', () => {
        it('should display the market price', () => {
            render(<Default />);
            expect(
                screen.getByTestId('current-market-price')
            ).toHaveTextContent('93.00');
        });
    });

    it('should update store when Sell order row is clicked', () => {
        const { store } = render(<Default />);
        const row = screen.getAllByTestId('sellOrders-row')[0];
        fireEvent.click(row);
        expect(store.getState().landingOrderForm.orderType).toEqual(
            OrderType.LIMIT
        );
        expect(store.getState().landingOrderForm.unitPrice).toEqual(9200);
    });

    it('should update store when Lend order row is clicked', async () => {
        const { store } = render(<Default />);
        const row = screen.getAllByTestId('buyOrders-row')[5];
        fireEvent.click(row);

        expect(store.getState().landingOrderForm.orderType).toEqual(
            OrderType.LIMIT
        );
        expect(store.getState().landingOrderForm.unitPrice).toEqual(9400);
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

        const expectToHaveRows = (name: string) =>
            within(screen.getByTestId(name)).getAllByRole('row').length > 0;
        const expectNotToHaveRows = (name: string) =>
            within(screen.getByTestId(name)).queryAllByRole('row').length === 0;

        it('should render three toggle buttons', () => {
            render(<Default />);
            expect(getButton('Show All Orders')).toBeInTheDocument();
            expect(getButton('Show Only Lend Orders')).toBeInTheDocument();
            expect(getButton('Show Only Borrow Orders')).toBeInTheDocument();
        });

        it('should render the Show All Orders button as active by default', () => {
            render(<Default />);
            expect(getButton('Show All Orders')).toHaveClass('bg-universeBlue');
            expect(getButton('Show Only Lend Orders')).not.toHaveClass(
                'bg-universeBlue'
            );
            expect(getButton('Show Only Borrow Orders')).not.toHaveClass(
                'bg-universeBlue'
            );
        });

        it('should toggle showBorrow state when Borrow button is clicked', () => {
            render(<Default />);
            expectToHaveRows('buyOrders');
            expectToHaveRows('sellOrders');

            fireEvent.click(getButton('Show Only Borrow Orders'));
            expect(getButton('Show All Orders')).not.toHaveClass(
                'bg-universeBlue'
            );
            expect(getButton('Show Only Lend Orders')).not.toHaveClass(
                'bg-universeBlue'
            );
            expect(getButton('Show Only Borrow Orders')).toHaveClass(
                'bg-universeBlue'
            );
            expectToHaveRows('buyOrders');
            expectNotToHaveRows('sellOrders');

            fireEvent.click(getButton('Show Only Borrow Orders'));
            expect(getButton('Show All Orders')).toHaveClass('bg-universeBlue');
            expect(getButton('Show Only Lend Orders')).not.toHaveClass(
                'bg-universeBlue'
            );
            expect(getButton('Show Only Borrow Orders')).not.toHaveClass(
                'bg-universeBlue'
            );
            expectToHaveRows('buyOrders');
            expectToHaveRows('sellOrders');
        });

        it('should toggle showLend state when Lend button is clicked', () => {
            render(<Default />);
            expectToHaveRows('buyOrders');
            expectToHaveRows('sellOrders');

            fireEvent.click(getButton('Show Only Lend Orders'));
            expect(getButton('Show All Orders')).not.toHaveClass(
                'bg-universeBlue'
            );
            expect(getButton('Show Only Lend Orders')).toHaveClass(
                'bg-universeBlue'
            );
            expect(getButton('Show Only Borrow Orders')).not.toHaveClass(
                'bg-universeBlue'
            );
            expectNotToHaveRows('buyOrders');
            expectToHaveRows('sellOrders');

            fireEvent.click(getButton('Show Only Lend Orders'));
            expect(getButton('Show All Orders')).toHaveClass('bg-universeBlue');
            expect(getButton('Show Only Lend Orders')).not.toHaveClass(
                'bg-universeBlue'
            );
            expect(getButton('Show Only Borrow Orders')).not.toHaveClass(
                'bg-universeBlue'
            );
            expectToHaveRows('buyOrders');
            expectToHaveRows('sellOrders');
        });

        it('should hide the current market price when Show Only Lend Orders is clicked and show it again when re clicked', () => {
            render(<Default />);
            expect(
                screen.getByTestId('current-market-price')
            ).toBeInTheDocument();
            fireEvent.click(getButton('Show Only Lend Orders'));
            expect(
                screen.queryByTestId('current-market-price')
            ).not.toBeInTheDocument();
            fireEvent.click(getButton('Show Only Lend Orders'));
            expect(
                screen.getByTestId('current-market-price')
            ).toBeInTheDocument();
        });

        it('should be able to toggle between Show Only Lend Orders and Show Only Borrow Orders', () => {
            render(<Default />);
            expect(screen.getByTestId('buyOrders')).toBeInTheDocument();
            expect(screen.getByTestId('sellOrders')).toBeInTheDocument();
            expect(
                screen.getByTestId('current-market-price')
            ).toBeInTheDocument();

            fireEvent.click(getButton('Show Only Lend Orders'));
            expectNotToHaveRows('buyOrders');
            expectToHaveRows('sellOrders');
            expect(
                screen.queryByTestId('current-market-price')
            ).not.toBeInTheDocument();

            fireEvent.click(getButton('Show Only Borrow Orders'));
            expectToHaveRows('buyOrders');
            expectNotToHaveRows('sellOrders');
            expect(
                screen.queryByTestId('current-market-price')
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
            const dropdown = screen.getByRole('button', { name: '0.01' });
            fireEvent.click(dropdown);
            const options = screen.getAllByRole('menuitem');
            expect(options).toHaveLength(5);
            expect(options[0]).toHaveTextContent('0.01');
            expect(options[1]).toHaveTextContent('0.1');
            expect(options[2]).toHaveTextContent('1');
            expect(options[3]).toHaveTextContent('5');
            expect(options[4]).toHaveTextContent('10');
        });

        it('should update the aggregation when an option is clicked', () => {
            render(<Default />);
            const dropdown = screen.getByRole('button', { name: '0.01' });
            fireEvent.click(dropdown);
            const options = screen.getAllByRole('menuitem');
            fireEvent.click(options[4]);
            expect(screen.getAllByTestId('buyOrders-row')).toHaveLength(2);
            expect(screen.getAllByTestId('sellOrders-row')).toHaveLength(2);
        });

        it('should conserve the sum of the amounts when aggregating', () => {
            render(<Default />);
            function sumSecondColumn(table: HTMLElement): number {
                return within(table)
                    .getAllByRole('row')
                    .reduce((sum, row) => {
                        const amount =
                            row.children[1].children[0].children[0]
                                .textContent ?? '';

                        return isNaN(parseInt(amount))
                            ? sum
                            : sum + parseInt(amount.replace(',', ''), 10);
                    }, 0);
            }
            const sumBefore = sumSecondColumn(screen.getByTestId('buyOrders'));
            const dropdown = screen.getByRole('button', { name: '0.01' });
            fireEvent.click(dropdown);
            const options = screen.getAllByRole('menuitem');
            fireEvent.click(options[3]);
            const sumAfter = sumSecondColumn(screen.getByTestId('buyOrders'));
            expect(sumBefore).toEqual(sumAfter);
            fireEvent.click(options[4]);
            const sumAfterAgain = sumSecondColumn(
                screen.getByTestId('buyOrders')
            );
            expect(sumBefore).toEqual(sumAfterAgain);
        });

        it('should change the precision of the prices when changing the aggregation factor', () => {
            const getOrderRowTextContent = (id: string) => {
                return screen
                    .getAllByTestId(id)
                    .map(row => row.children[0].textContent);
            };

            render(<Default />);
            const dropdown = screen.getByRole('button', { name: '0.01' });
            fireEvent.click(dropdown);

            const options = screen.getAllByRole('menuitem');
            fireEvent.click(options[1]);
            expect(getOrderRowTextContent('buyOrders-row')).toEqual([
                '\xa0', // this is a non-breaking space
                '98.5',
                '97.0',
                '95.0',
                '94.7',
                '94.0',
            ]);
            expect(getOrderRowTextContent('sellOrders-row')).toEqual([
                '92.0',
                '91.1',
                '90.5',
                '90.1',
                '89.8',
                '89.6',
            ]);
        });
    });

    describe('Variants', () => {
        it('should display the current market price in the correct color', () => {
            render(<Itayose />);
            expect(screen.getByTestId('current-market-price')).toHaveClass(
                'text-white'
            );
        });

        it('should display a help tooltip', () => {
            render(<Itayose />);
            expect(screen.getByTestId('tooltip')).toBeInTheDocument();
        });
    });
});
