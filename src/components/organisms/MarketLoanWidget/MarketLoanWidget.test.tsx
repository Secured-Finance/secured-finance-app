import { composeStories } from '@storybook/react';
import {
    dec24Fixture,
    preloadedLendingMarkets,
} from 'src/stories/mocks/fixtures';
import { render, screen } from 'src/test-utils.js';
import { CurrencySymbol } from 'src/utils';
import * as stories from './MarketLoanWidget.stories';

const { Default } = composeStories(stories);

describe.skip('MarketLoanWidget Component', () => {
    it('should filter by currency', () => {
        render(<Default />);
        expect(screen.queryByText('WBTC')).toBeInTheDocument();
        screen.getByRole('button', { name: 'All Assets' }).click();
        screen.getByRole('menuitem', { name: 'Filecoin' }).click();
        expect(screen.queryByText('WBTC')).not.toBeInTheDocument();
    });

    it('should filter by maturity', () => {
        render(<Default />);
        expect(screen.getAllByText('Dec 1, 2022').length).toEqual(2);
        screen.getByRole('button', { name: 'DEC22' }).click();
        screen.getByRole('menuitem', { name: 'JUN23' }).click();
        expect(screen.queryByText('Dec 1, 2022')).not.toBeInTheDocument();
        expect(screen.getAllByText('Jun 1, 2023').length).toEqual(2);
    });

    it('should dedupe maturity and add a "All" option', () => {
        render(<Default />);
        screen.getByRole('button', { name: 'DEC22' }).click();
        expect(screen.getAllByRole('menuitem').length).toBe(10);
        expect(screen.queryByText('All')).toBeInTheDocument();
    });

    it('should display the APR column when the market is open', () => {
        render(<Default />);
        expect(screen.queryByText('APR')).toBeInTheDocument();
        expect(screen.queryByText('Market Open')).not.toBeInTheDocument();
    });

    it('should hide the APR column when the market is in pre-order', () => {
        render(<Default />);
        screen.getByRole('button', { name: 'DEC22' }).click();
        screen.getByRole('menuitem', { name: 'DEC24' }).click();
        expect(screen.queryByText('APR')).not.toBeInTheDocument();
        expect(screen.queryByText('Market Open')).toBeInTheDocument();
    });

    it('should hide the APR column when the market is in itayose mode', () => {
        render(<Default />, {
            preloadedState: {
                ...preloadedLendingMarkets,
                availableContracts: {
                    ...preloadedLendingMarkets.availableContracts,
                    lendingMarket: {
                        [CurrencySymbol.WBTC]: {
                            ...preloadedLendingMarkets.availableContracts
                                ?.lendingMarkets?.[CurrencySymbol.WBTC],
                            [dec24Fixture.toNumber()]: {
                                ...preloadedLendingMarkets.availableContracts
                                    ?.lendingMarkets?.[CurrencySymbol.WBTC]?.[
                                    dec24Fixture.toNumber()
                                ],
                                itayose: true,
                            },
                        },
                    },
                },
            },
        });
        screen.getByRole('button', { name: 'DEC22' }).click();
        screen.getByRole('menuitem', { name: 'DEC24' }).click();
        expect(screen.queryByText('APR')).not.toBeInTheDocument();
        expect(screen.queryByText('Market Open')).toBeInTheDocument();
    });
});
