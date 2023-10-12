import { Currency } from '@secured-finance/sf-core';
import { composeStories } from '@storybook/react';
import { preloadedEthBalance } from 'src/stories/mocks/fixtures';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { render, screen, waitFor } from 'src/test-utils.js';
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
    it('should render PortfolioManagement', async () => {
        await waitFor(() =>
            render(<Default />, {
                apolloMocks: Default.parameters?.apolloClient.mocks,
                preloadedState: preloadedEthBalance,
            })
        );
    });

    it('should show delisting disclaimer if a user has active contracts in currency being delisted', async () => {
        await waitFor(() =>
            render(<ConnectedToWallet />, {
                apolloMocks: Default.parameters?.apolloClient.mocks,
                preloadedState: preloadedEthBalance,
            })
        );
        await waitFor(() => {
            expect(
                screen.getByText(
                    'Please note that your contracts for WFIL will be delisted at maturity on Secured Finance.'
                )
            ).toBeInTheDocument();
        });
    });

    it('should not show delisting disclaimer if no currency is being delisted', async () => {
        jest.spyOn(mock, 'currencyExists').mockResolvedValue(true);
        await waitFor(() =>
            render(<ConnectedToWallet />, {
                apolloMocks: Default.parameters?.apolloClient.mocks,
                preloadedState: preloadedEthBalance,
            })
        );

        await waitFor(() => {
            expect(
                screen.queryByText(
                    'Please note that your contracts for WFIL will be delisted at maturity on Secured Finance.'
                )
            ).not.toBeInTheDocument();
        });
    });

    it('should not show delisting disclaimer if user does not have active contracts in currency being delisted', async () => {
        jest.spyOn(mock, 'currencyExists').mockImplementation(
            (currency: Currency) => {
                if (currency.symbol === CurrencySymbol.USDC) {
                    return Promise.resolve(true);
                } else {
                    return Promise.resolve(false);
                }
            }
        );
        await waitFor(() =>
            render(<ConnectedToWallet />, {
                apolloMocks: Default.parameters?.apolloClient.mocks,
                preloadedState: preloadedEthBalance,
            })
        );

        await waitFor(() => {
            expect(
                screen.queryByText(
                    'Please note that your contracts for WFIL will be delisted at maturity on Secured Finance.'
                )
            ).not.toBeInTheDocument();
        });
    });
});
