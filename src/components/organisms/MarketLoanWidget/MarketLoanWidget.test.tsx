import { composeStories } from '@storybook/react';
import { wbtcBytes32 } from 'src/stories/mocks/fixtures';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { fireEvent, render, screen, waitFor } from 'src/test-utils.js';
import * as stories from './MarketLoanWidget.stories';

const { Default } = composeStories(stories);

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

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
        expect(screen.getAllByText('Dec 1, 2022').length).toEqual(4);
        screen.getByRole('button', { name: 'DEC22' }).click();
        screen.getByRole('menuitem', { name: 'JUN23' }).click();
        expect(screen.queryByText('Dec 1, 2022')).not.toBeInTheDocument();
        expect(screen.getAllByText('Jun 1, 2023').length).toEqual(4);
    });

    it('should dedupe maturity and add a "All" option', () => {
        render(<Default />);
        screen.getByRole('button', { name: 'DEC22' }).click();
        expect(screen.getAllByRole('menuitem').length).toBe(9);
        expect(screen.queryByText('All')).toBeInTheDocument();
    });

    it('should display the APR column when the market is open', () => {
        render(<Default />);
        expect(screen.queryByText('APR')).toBeInTheDocument();
        expect(screen.queryByText('Market Open')).not.toBeInTheDocument();
    });

    it('should hide the APR column when the market is in pre-order', async () => {
        render(<Default />);
        const button = screen.getByText('Pre-Open');
        await waitFor(() => {
            fireEvent.click(button);
        });

        expect(screen.queryAllByText('Dec 1, 2024')).toHaveLength(4);
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
        const button = screen.getByText('Pre-Open');
        await waitFor(() => {
            fireEvent.click(button);
        });
        expect(screen.queryByText('APR')).not.toBeInTheDocument();
        expect(screen.queryByText('Market Open')).toBeInTheDocument();
    });

    it('should not show maturity dropdown in itayose screen', async () => {
        render(<Default />);
        const button = screen.getByText('Pre-Open');
        await waitFor(() => {
            fireEvent.click(button);
        });

        expect(screen.getByText('All Assets')).toBeInTheDocument();
        expect(
            screen.queryByRole('button', { name: 'DEC24' })
        ).not.toBeInTheDocument();
    });
});
