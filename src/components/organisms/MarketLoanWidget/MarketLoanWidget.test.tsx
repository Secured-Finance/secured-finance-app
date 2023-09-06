import { composeStories } from '@storybook/react';
import { wbtcBytes32 } from 'src/stories/mocks/fixtures';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { render, screen } from 'src/test-utils.js';
import * as stories from './MarketLoanWidget.stories';

const { Default } = composeStories(stories);

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

describe('MarketLoanWidget Component', () => {
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

    it('should hide the APR column when the market is in itayose mode', async () => {
        const lendingMarkets = await mock.getOrderBookDetails();
        const marketIndex = lendingMarkets.findIndex(
            value => value.ccy === wbtcBytes32 && value.name === 'DEC24'
        );
        const market = lendingMarkets[marketIndex];
        lendingMarkets[marketIndex] = {
            ...market,
            isPreOrderPeriod: false,
            isItayosePeriod: true,
        };
        mock.getOrderBookDetails.mockResolvedValueOnce(lendingMarkets);

        render(<Default />);
        screen.getByRole('button', { name: 'DEC22' }).click();
        screen.getByRole('menuitem', { name: 'DEC24' }).click();
        expect(screen.queryByText('APR')).not.toBeInTheDocument();
        expect(screen.queryByText('Market Open')).toBeInTheDocument();
    });
});
