import { composeStories } from '@storybook/react';
import { wbtcBytes32 } from 'src/stories/mocks/fixtures';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { fireEvent, render, screen, waitFor } from 'src/test-utils.js';
import * as stories from './MarketLoanWidget.stories';

const { Default, GlobalItayose } = composeStories(stories);

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

describe('MarketLoanWidget Component', () => {
    it('should filter by currency', async () => {
        render(<Default />);
        await waitFor(() => {
            expect(screen.queryByText('WBTC')).toBeInTheDocument();
            screen.getByRole('button', { name: 'All Assets' }).click();
            screen.getByRole('menuitem', { name: 'WFIL' }).click();
        });
        expect(screen.queryByText('WBTC')).not.toBeInTheDocument();
    });

    it('should filter by maturity', async () => {
        render(<Default />);
        await waitFor(() => {
            expect(screen.getAllByText('Dec 1, 2022').length).toEqual(4);
            screen.getByRole('button', { name: 'DEC22' }).click();
            screen.getByRole('menuitem', { name: 'JUN23' }).click();
        });
        expect(screen.queryByText('Dec 1, 2022')).not.toBeInTheDocument();
        expect(screen.getAllByText('Jun 1, 2023').length).toEqual(4);
    });

    it('should dedupe maturity and add a "All" option', async () => {
        render(<Default />);
        await waitFor(() => {
            screen.getByRole('button', { name: 'DEC22' }).click();
        });

        expect(screen.getAllByRole('menuitem').length).toBe(9);
        expect(screen.queryByText('All')).toBeInTheDocument();
    });

    it('should display the APR column when the market is open', () => {
        render(<Default />);
        expect(screen.queryByText('APR')).toBeInTheDocument();
        expect(screen.queryByText('Market Opens')).not.toBeInTheDocument();
    });

    it('should not show delisted currencies', async () => {
        render(<Default />);
        const button = screen.getByTestId('Pre-Open');
        await waitFor(() => expect(button).not.toBeDisabled());
        fireEvent.click(button);
        expect(screen.queryAllByText('Dec 1, 2024')).toHaveLength(3);

        expect(screen.queryByText('WFIL')).not.toBeInTheDocument();
    });

    it('should hide the APR column when the market is in pre-order', async () => {
        jest.spyOn(mock, 'currencyExists').mockResolvedValue(true);
        render(<Default />);
        const button = screen.getByTestId('Pre-Open');
        await waitFor(() => expect(button).not.toBeDisabled());
        fireEvent.click(button);
        expect(screen.queryAllByText('Dec 1, 2024')).toHaveLength(4);

        expect(screen.queryByText('APR')).not.toBeInTheDocument();
        expect(screen.queryByText('Market Opens')).toBeInTheDocument();
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
        const button = screen.getByTestId('Pre-Open');
        await waitFor(() => expect(button).not.toBeDisabled());
        fireEvent.click(button);
        expect(screen.queryByText('APR')).not.toBeInTheDocument();
        expect(screen.queryByText('Market Opens')).toBeInTheDocument();
    });

    it('should not show maturity dropdown in itayose screen', async () => {
        render(<Default />);
        const button = screen.getByTestId('Pre-Open');
        await waitFor(() => expect(button).not.toBeDisabled());
        fireEvent.click(button);

        expect(screen.queryByText('APR')).not.toBeInTheDocument();
        expect(screen.getByText('All Assets')).toBeInTheDocument();
        expect(
            screen.queryByRole('button', { name: 'DEC24' })
        ).not.toBeInTheDocument();
    });

    it('should disble pre open tab if no itayose or pre order market is available', async () => {
        const lendingMarkets = await mock.getOrderBookDetails();
        mock.getOrderBookDetails.mockResolvedValueOnce(
            lendingMarkets.slice(0, 8)
        );

        render(<Default />);
        const button = screen.getByTestId('Pre-Open');
        expect(screen.queryByText('NEW')).not.toBeInTheDocument();
        await waitFor(() => expect(button).toBeDisabled());
    });

    it('should not display Loans tab when there is no open market', () => {
        render(<GlobalItayose />);
        expect(screen.queryByText('Loans')).not.toBeInTheDocument();
    });
});
