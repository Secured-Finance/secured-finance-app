import { OrderSide } from '@secured-finance/sf-client';
import { composeStories } from '@storybook/testing-react';
import {
    preloadedBalances,
    preloadedLendingMarkets,
} from 'src/stories/mocks/fixtures';
import { fireEvent, render, screen, waitFor } from 'src/test-utils.js';
import { OrderType } from 'src/types';
import { CurrencySymbol } from 'src/utils';
import * as stories from './Landing.stories';

const { Default } = composeStories(stories);

jest.mock('next/router', () => ({
    useRouter: jest.fn(() => ({
        pathname: '/',
        push: jest.fn(),
    })),
}));

jest.mock(
    'next/link',
    () =>
        ({ children }: { children: React.ReactNode }) =>
            children
);

const preloadedState = { ...preloadedBalances, ...preloadedLendingMarkets };

describe('Landing Component', () => {
    it('should render a Landing', () => {
        render(<Default />, { preloadedState });
    });

    it('should change the rate when the user changes the maturity', () => {
        render(<Default />, { preloadedState });
        waitFor(() => {
            expect(screen.getByTestId('rate')).toHaveTextContent('1%');
        });

        waitFor(() => {
            fireEvent.click(screen.getByText('MAR22'));
            fireEvent.click(screen.getByText('DEC22'));
        });

        waitFor(() => {
            expect(screen.getByTestId('rate')).toHaveTextContent('2%');
        });
    });

    it('should select the market order type when the user change to advance mode', async () => {
        waitFor(() => {
            render(<Default />, {
                apolloMocks: Default.parameters?.apolloClient.mocks,
                preloadedState,
            });
            fireEvent.click(screen.getByText('Advanced'));
        });

        expect(screen.getByRole('radio', { name: 'Limit' })).toBeChecked();
        expect(screen.getByRole('radio', { name: 'Market' })).not.toBeChecked();
    });

    it('should open the landing page with the mode set in the store', async () => {
        waitFor(() => {
            render(<Default />, {
                apolloMocks: Default.parameters?.apolloClient.mocks,
                preloadedState: {
                    ...preloadedState,
                    landingOrderForm: {
                        currency: CurrencySymbol.EFIL,
                        maturity: 0,
                        side: OrderSide.BORROW,
                        amount: '0',
                        unitPrice: 0,
                        orderType: OrderType.MARKET,
                        lastView: 'Advanced',
                    },
                },
            });
        });
        expect(screen.getByRole('radio', { name: 'Advanced' })).toBeChecked();
    });

    it('should save in the store the last view used', async () => {
        waitFor(() => {
            const { store } = render(<Default />, {
                apolloMocks: Default.parameters?.apolloClient.mocks,
                preloadedState,
            });
            expect(store.getState().landingOrderForm.lastView).toBe('Simple');
            fireEvent.click(screen.getByText('Advanced'));
            expect(store.getState().landingOrderForm.lastView).toBe('Advanced');
        });
    });

    it('should filter out non ready markets', async () => {
        waitFor(() => {
            render(<Default />, {
                apolloMocks: Default.parameters?.apolloClient.mocks,
                preloadedState,
            });
        });

        expect(screen.getByText('DEC22')).toBeInTheDocument();
        fireEvent.click(screen.getByText('DEC22'));
        expect(screen.getByText('MAR23')).toBeInTheDocument();
        expect(screen.queryByText('DEC24')).not.toBeInTheDocument();
    });
});
