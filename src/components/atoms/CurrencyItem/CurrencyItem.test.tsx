import { composeStories } from '@storybook/testing-react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './CurrencyItem.stories';

const { Default, CurrencyPrice, CurrencyName } = composeStories(stories);

describe('CurrencyAmountItem Component', () => {
    it('should render a CurrencyAmountItem', () => {
        render(<Default />);
    });

    it('should render the currency amount in USD with two decimals', () => {
        render(<Default amount={100} price={5} />);
        expect(screen.getByText('$500.00 USD')).toBeInTheDocument();
    });

    it('should render the formatted currency amount in FIL', () => {
        render(<Default />);
        expect(screen.getByText('1,000 FIL')).toBeInTheDocument();
    });

    it('should align the currency amount to the right', () => {
        render(<Default align='right' />);
        expect(screen.getByTestId('currency-amount-item')).toHaveClass(
            'text-right'
        );
    });

    it('should align the currency amount to the center', () => {
        render(<Default align='center' />);
        expect(screen.getByTestId('currency-amount-item')).toHaveClass(
            'text-center'
        );
    });

    it('should align the currency amount to the left by default', () => {
        render(<Default />);
        expect(screen.getByTestId('currency-amount-item')).toHaveClass(
            'text-left'
        );
    });

    it('should render information about the currency when no amount is defined', () => {
        render(<CurrencyPrice />);
        expect(screen.getByText('FIL')).toBeInTheDocument();
        expect(screen.getByText('$8.20 USD')).toBeInTheDocument();
    });

    it('should render the currency name when no amount and no price are defined', () => {
        render(<CurrencyName />);
        expect(screen.getByText('FIL')).toBeInTheDocument();
        expect(screen.getByText('Filecoin')).toBeInTheDocument();
    });
});
