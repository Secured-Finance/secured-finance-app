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

    it('should display the last mid price', () => {
        render(<Default />);
        expect(screen.getByTestId('last-mid-price')).toHaveTextContent('96.72');
    });

    it('should write the last mid price in the store', () => {
        const { store } = render(<Default />);
        expect(store.getState().analytics.midPrice).toBe(9671.5);
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

    it('should update store when Borrow order row is clicked', () => {
        const { store } = render(<Default />);
        const row = screen.getAllByTestId('sellOrders-row')[0];
        fireEvent.click(row);
        expect(store.getState().landingOrderForm.orderType).toEqual(
            OrderType.LIMIT
        );

        expect(store.getState().landingOrderForm.amount).toEqual(
            '43000000000000000000000'
        );

        expect(store.getState().landingOrderForm.unitPrice).toEqual(9690);

        expect(store.getState().landingOrderForm.side).toEqual(
            OrderSide.BORROW
        );
    });

    it('should update store when Lend order row is clicked', async () => {
        const { store } = render(<Default />);
        const row = screen.getAllByTestId('buyOrders-row')[0];
        fireEvent.click(row);

        expect(store.getState().landingOrderForm.orderType).toEqual(
            OrderType.LIMIT
        );

        expect(store.getState().landingOrderForm.amount).toEqual(
            '43003200000000000000000'
        );

        expect(store.getState().landingOrderForm.unitPrice).toEqual(9653);

        expect(store.getState().landingOrderForm.side).toEqual(OrderSide.LEND);
    });

    it('should hide the mid price when hideMidPrice is true', () => {
        render(<Default hideMidPrice />);
        expect(screen.queryByTestId('last-mid-price')).not.toBeInTheDocument();
    });

    it('should display the spinner when loading', () => {
        render(<Loading />);
        expect(
            screen.getByRole('alertdialog', { name: 'Loading' })
        ).toBeInTheDocument();
    });
});
