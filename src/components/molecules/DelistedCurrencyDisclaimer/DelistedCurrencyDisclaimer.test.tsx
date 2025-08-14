import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './DelistedCurrencyDisclaimer.stories';

const { Default, TwoCurrencies, MultipleCurrencies } = composeStories(stories);

describe('DelistedCurrencyDisclaimer test', () => {
    it('should render disclaimer for one currency', () => {
        render(<Default />);
        expect(
            screen.getByText(
                'Please note that WFIL will be delisted on Secured Finance.',
            ),
        ).toBeInTheDocument();
    });

    it('should render disclaimer for two currencies ', () => {
        render(<TwoCurrencies />);
        expect(
            screen.getByText(
                'Please note that WFIL and ETH will be delisted on Secured Finance.',
            ),
        ).toBeInTheDocument();
    });

    it('should render disclaimer for multiple currencies ', () => {
        render(<MultipleCurrencies />);
        expect(
            screen.getByText(
                'Please note that WFIL, ETH and USDC will be delisted on Secured Finance.',
            ),
        ).toBeInTheDocument();
    });

    it('should not render disclaimer if user has previously closed the disclaimer', () => {
        localStorage.setItem('DELISTED_CURRENCIES_KEY', 'ETH,USDC,WFIL');
        render(<MultipleCurrencies />);
        expect(
            screen.queryByText(
                'Please note that WFIL, ETH and USDC will be delisted on Secured Finance.',
            ),
        ).not.toBeInTheDocument();
    });
});
