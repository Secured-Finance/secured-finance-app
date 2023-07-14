import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './PriceYieldItem.stories';

const { Default } = composeStories(stories);

describe('PriceYieldItem Component', () => {
    it('should render a PriceYieldItem', () => {
        render(<Default />);
    });

    it('renders the loan value and rate', () => {
        render(<Default />);

        expect(screen.getByText('98.00')).toBeInTheDocument();
    });

    it('renders the loan value and rate with the specified alignment', () => {
        render(<Default align='right' />);

        expect(screen.getByText('98.00').parentElement).toHaveClass(
            'text-right'
        );
    });
});
