import { composeStories } from '@storybook/testing-react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './AmountCard.stories';

const { Default } = composeStories(stories);

describe('AmountCard Component', () => {
    it('should render a AmountCard', () => {
        render(<Default />);
    });

    it('should render a AmountCard with the name of the currency', () => {
        render(<Default />);
        expect(screen.getByText('WFIL')).toBeInTheDocument();
    });

    it('should render a AmountCard with the amount of the currency', () => {
        render(<Default />);
        expect(screen.getByText('5,000')).toBeInTheDocument();
    });

    it('should render a AmountCard with the symbol of the currency', () => {
        render(<Default />);
        expect(screen.getByText('WFIL')).toBeInTheDocument();
    });

    it('should render a AmountCard with the amount in USD', () => {
        render(<Default />);
        expect(screen.getByText('~ $41,500')).toBeInTheDocument();
    });
});
