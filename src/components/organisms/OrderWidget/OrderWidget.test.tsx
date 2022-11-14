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
});
