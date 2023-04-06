import { composeStories } from '@storybook/testing-react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './CurrencyItem.stories';

const { Default, CurrencyPrice, CurrencyName, Compact } =
    composeStories(stories);

describe('CurrencyAmountItem Component', () => {
    it('should render a CurrencyAmountItem', () => {
        render(<Default />);
    });

    it('should render the currency amount in USD with two decimals', () => {
        render(<Default amount={100} price={5} />);
        expect(screen.getByText('$500.00 USD')).toBeInTheDocument();
    });

    it('should render the formatted currency amount in EFIL', () => {
        render(<Default />);
        expect(screen.getByText('1,000 EFIL')).toBeInTheDocument();
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
        expect(screen.getByText('EFIL')).toBeInTheDocument();
        expect(screen.getByText('$8.20 USD')).toBeInTheDocument();
    });

    it('should render the currency name when no amount and no price are defined', () => {
        render(<CurrencyName />);
        expect(screen.getAllByText('EFIL')).toHaveLength(2);
    });

    it('should display the currency amount in neutral by default', () => {
        render(<Default />);
        expect(
            screen.getByTestId('currency-amount-item').firstChild
        ).toHaveClass('text-neutral-8');
    });

    it('should display the currency amount in green', () => {
        render(<Default color='positive' />);
        expect(
            screen.getByTestId('currency-amount-item').firstChild
        ).toHaveClass('text-nebulaTeal');
    });

    it('should display the currency amount in red', () => {
        render(<Default color='negative' />);
        expect(
            screen.getByTestId('currency-amount-item').firstChild
        ).toHaveClass('text-galacticOrange');
    });

    it('should display only one line of text when Compact is true', () => {
        render(<Compact />);
        expect(screen.getByText('1,000 EFIL')).toBeInTheDocument();
    });
});
