import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './CurrencyItem.stories';

const { Default, CurrencyPrice, CurrencyName, Compact } =
    composeStories(stories);

describe('CurrencyAmountItem Component', () => {
    it('should render a CurrencyAmountItem', () => {
        render(<Default />);
    });

    it('should render the currency amount in USD with two decimals', () => {
        render(<Default amount={BigInt('100000000000000000000')} price={5} />);
        expect(screen.getByText('$500.00')).toBeInTheDocument();
    });

    it('should render the formatted currency amount in WFIL', () => {
        render(<Default />);
        expect(screen.getByText('1,000')).toBeInTheDocument();
    });

    it('should align the currency amount to the right', () => {
        render(<Default align='right' />);
        expect(screen.getByTestId('currency-amount-item')).toHaveClass(
            'text-right',
        );
    });

    it('should align the currency amount to the center', () => {
        render(<Default align='center' />);
        expect(screen.getByTestId('currency-amount-item')).toHaveClass(
            'text-center',
        );
    });

    it('should align the currency amount to the left by default', () => {
        render(<Default />);
        expect(screen.getByTestId('currency-amount-item')).toHaveClass(
            'text-left',
        );
    });

    it('should render information about the currency when no amount is defined', () => {
        render(<CurrencyPrice />);
        expect(screen.getByText('WFIL')).toBeInTheDocument();
        expect(screen.getByText('$8.20')).toBeInTheDocument();
    });

    it('should render the currency name when no amount and no price are defined', () => {
        render(<CurrencyName />);
        expect(screen.getByText('Filecoin')).toBeInTheDocument();
    });

    it('should display the currency amount in neutral by default', () => {
        render(<Default />);
        expect(
            screen.getByTestId('currency-amount-item').firstChild,
        ).toHaveClass('text-neutral-8');
    });

    it('should display the currency amount in green', () => {
        render(<Default color='positive' />);
        expect(
            screen.getByTestId('currency-amount-item').firstChild,
        ).toHaveClass('text-nebulaTeal');
    });

    it('should display the currency amount in red', () => {
        render(<Default color='negative' />);
        expect(
            screen.getByTestId('currency-amount-item').firstChild,
        ).toHaveClass('text-galacticOrange');
    });

    it('should display only one line of text when Compact is true', () => {
        render(<Compact />);
        expect(screen.getByText('1,000')).toBeInTheDocument();
    });

    it('should show the currency symbol when showCurrency is true', () => {
        render(<Default showCurrency={true} />);
        expect(screen.getByText('1,000 WFIL')).toBeInTheDocument();
    });
});
