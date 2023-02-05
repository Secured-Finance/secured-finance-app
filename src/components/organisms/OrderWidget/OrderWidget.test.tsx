import { composeStories } from '@storybook/testing-react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './OrderWidget.stories';

const { Default } = composeStories(stories);

describe('OrderWidget Component', () => {
    it('should render a OrderWidget', () => {
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
        render(<Default buyOrders={[]} />);
        expect(screen.getByTestId('last-mid-price')).toHaveTextContent('0');
    });
});
