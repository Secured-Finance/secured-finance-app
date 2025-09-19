import { Currency } from '@secured-finance/sf-core';
import { composeStories } from '@storybook/react';
import { preloadedBalance } from 'src/stories/mocks/fixtures';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import {
    render,
    screen,
    waitFor,
    cleanupGraphQLMocks,
} from 'src/test-utils.js';
import graphqlMocks from 'src/test-utils/mockData';
import { CurrencySymbol } from 'src/utils';
import * as stories from './PortfolioManagement.stories';

const { Default, ConnectedToWallet } = composeStories(stories);

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

const mock = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mock);

describe('PortfolioManagement component', () => {
    afterEach(() => {
        cleanupGraphQLMocks();
    });

    it('should render PortfolioManagement', async () => {
        await waitFor(() =>
            render(<Default />, {
                graphqlMocks: graphqlMocks.withTransactions,
                preloadedState: preloadedBalance,
            })
        );
    });

    it('should show delisting disclaimer if a user has active contracts in currency being delisted', async () => {
        await waitFor(() =>
            render(<ConnectedToWallet />, {
                graphqlMocks: graphqlMocks.withTransactions,
                preloadedState: preloadedBalance,
            })
        );
        await waitFor(() => {
            expect(
                screen.getByText(
                    'Please note that your contracts for USDC will be delisted at maturity on Secured Finance.'
                )
            ).toBeInTheDocument();
        });
    });

    it('should not show delisting disclaimer if user has previously closed the disclaimer', async () => {
        localStorage.setItem('DELISTED_CURRENCIES_KEY', 'USDC');
        await waitFor(() =>
            render(<ConnectedToWallet />, {
                graphqlMocks: graphqlMocks.withTransactions,
                preloadedState: preloadedBalance,
            })
        );
        await waitFor(() => {
            expect(
                screen.queryByText(
                    'Please note that your contracts for USDC will be delisted at maturity on Secured Finance.'
                )
            ).not.toBeInTheDocument();
        });
    });

    it('should not show delisting disclaimer if no currency is being delisted', async () => {
        jest.spyOn(mock, 'currencyExists').mockResolvedValue(true);
        await waitFor(() =>
            render(<ConnectedToWallet />, {
                graphqlMocks: graphqlMocks.withTransactions,
                preloadedState: preloadedBalance,
            })
        );

        await waitFor(() => {
            expect(
                screen.queryByText(
                    'Please note that your contracts for USDC will be delisted at maturity on Secured Finance.'
                )
            ).not.toBeInTheDocument();
        });
    });

    it('should not show delisting disclaimer if user does not have active contracts in currency being delisted', async () => {
        jest.spyOn(mock, 'currencyExists').mockImplementation(
            (currency: Currency) => {
                if (currency.symbol === CurrencySymbol.WBTC) {
                    return Promise.resolve(false);
                } else {
                    return Promise.resolve(true);
                }
            }
        );
        await waitFor(() =>
            render(<ConnectedToWallet />, {
                graphqlMocks: graphqlMocks.withTransactions,
                preloadedState: preloadedBalance,
            })
        );

        await waitFor(() => {
            expect(
                screen.queryByText(
                    'Please note that your contracts for WBTC will be delisted at maturity on Secured Finance.'
                )
            ).not.toBeInTheDocument();
        });
    });
});
