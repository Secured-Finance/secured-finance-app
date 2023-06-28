import { OrderSide } from '@secured-finance/sf-client';
import { composeStories } from '@storybook/testing-react';
import {
    preloadedBalances,
    preloadedLendingMarkets,
} from 'src/stories/mocks/fixtures';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { fireEvent, render, screen, waitFor } from 'src/test-utils.js';
import { OrderType } from 'src/types';
import { CurrencySymbol } from 'src/utils';
import timemachine from 'timemachine';
import * as stories from './Landing.stories';

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

const preloadedState = { ...preloadedBalances, ...preloadedLendingMarkets };

describe.skip('Landing Component', () => {
    it('should change the rate when the user changes the maturity', async () => {
        timemachine.config({
            dateString: '2022-02-01T11:00:00.00Z',
        });
        render(<Default />, {
            apolloMocks: Default.parameters?.apolloClient.mocks,
            preloadedState: {
                ...preloadedState,
                landingOrderForm: {
                    currency: CurrencySymbol.EFIL,
                    maturity: 1669852800,
                    side: OrderSide.BORROW,
                    amount: '500000000',
                    unitPrice: 9500,
                    orderType: OrderType.LIMIT,
                    marketPhase: 'Open',
                },
            },
        });

        await waitFor(() => {
            expect(screen.getByTestId('market-rate')).toHaveTextContent(
                '3.93%'
            );
        });

        fireEvent.click(screen.getByRole('button', { name: 'DEC22' }));
        fireEvent.click(screen.getByText('MAR23'));
        expect(screen.getByTestId('market-rate')).toHaveTextContent('3.04%');
        timemachine.config({
            dateString: '2021-12-01T11:00:00.00Z',
        });
    }, 10000); //TODO: TEST THROWS TIMEOUT EXCEEDED WARNING ON GITHUB ACTIONS

    it('should select the limit order type when the user change to advance mode', async () => {
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

    it('should select the market order type when the user clicks on market tab', async () => {
        waitFor(() => {
            render(<Default />, {
                apolloMocks: Default.parameters?.apolloClient.mocks,
                preloadedState,
            });
            fireEvent.click(screen.getByText('Advanced'));
        });

        expect(screen.getByRole('radio', { name: 'Limit' })).toBeChecked();

        fireEvent.click(screen.getByRole('radio', { name: 'Market' }));
        expect(screen.getByRole('radio', { name: 'Market' })).toBeChecked();
    });

    it('should display the best price as bond price when user change to advance mode', async () => {
        await waitFor(() => {
            render(<Default />, {
                apolloMocks: Default.parameters?.apolloClient.mocks,
                preloadedState,
            });
            fireEvent.click(screen.getByText('Advanced'));
        });
        expect(screen.getByRole('textbox', { name: 'Amount' })).toHaveValue(
            '0'
        );
        expect(screen.getByRole('textbox', { name: 'Bond Price' })).toHaveValue(
            '96.85'
        );
    });

    it('should reset the amount and bond price when user changes maturity', async () => {
        await waitFor(() => {
            render(<Default />, {
                apolloMocks: Default.parameters?.apolloClient.mocks,
                preloadedState,
            });
            fireEvent.click(screen.getByText('Advanced'));
        });
        fireEvent.change(screen.getByRole('textbox', { name: 'Amount' }), {
            target: { value: '1' },
        });
        fireEvent.change(screen.getByRole('textbox', { name: 'Bond Price' }), {
            target: { value: '80' },
        });
        expect(screen.getByRole('textbox', { name: 'Amount' })).toHaveValue(
            '1'
        );
        expect(screen.getByRole('textbox', { name: 'Bond Price' })).toHaveValue(
            '80'
        );

        fireEvent.click(screen.getByRole('button', { name: 'DEC22' }));
        fireEvent.click(screen.getByText('MAR23'));
        expect(screen.getByText('MAR23')).toBeInTheDocument();

        expect(screen.getByRole('textbox', { name: 'Amount' })).toHaveValue(
            '0'
        );
        expect(screen.getByRole('textbox', { name: 'Bond Price' })).toHaveValue(
            '96.83'
        );
    });

    it('should reset the amount and bond price when user changes currency', async () => {
        await waitFor(() => {
            render(<Default />, {
                apolloMocks: Default.parameters?.apolloClient.mocks,
                preloadedState,
            });
            fireEvent.click(screen.getByText('Advanced'));
        });
        fireEvent.change(screen.getByRole('textbox', { name: 'Amount' }), {
            target: { value: '1' },
        });
        fireEvent.change(screen.getByRole('textbox', { name: 'Bond Price' }), {
            target: { value: '80' },
        });
        expect(screen.getByRole('textbox', { name: 'Amount' })).toHaveValue(
            '1'
        );
        expect(screen.getByRole('textbox', { name: 'Bond Price' })).toHaveValue(
            '80'
        );

        fireEvent.click(screen.getByRole('button', { name: 'Filecoin' }));
        fireEvent.click(screen.getByRole('menuitem', { name: 'USDC' }));

        expect(screen.getByRole('textbox', { name: 'Amount' })).toHaveValue(
            '0'
        );
        expect(screen.getByRole('textbox', { name: 'Bond Price' })).toHaveValue(
            '96.85'
        );
    });

    it('should open the landing page with the mode set in the store', async () => {
        await waitFor(() => {
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
        await waitFor(() => {
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
        await waitFor(() => {
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

    it('should change the amount slider when amount input changes and user has balance', async () => {
        await waitFor(() => {
            render(<ConnectedToWallet />, {
                apolloMocks: Default.parameters?.apolloClient.mocks,
                preloadedState,
            });
            fireEvent.click(screen.getByText('Advanced'));
        });
        expect(screen.getByRole('slider')).toHaveValue('0');
        fireEvent.click(screen.getByRole('radio', { name: 'Lend' }));
        fireEvent.change(screen.getByRole('textbox', { name: 'Amount' }), {
            target: { value: '100' },
        });
        expect(screen.getByRole('slider')).toHaveValue('10');
        fireEvent.change(screen.getByRole('textbox', { name: 'Amount' }), {
            target: { value: '500' },
        });
        expect(screen.getByRole('slider')).toHaveValue('50');
    });

    it('should not change the amount slider when amount input changes and user do not have balance', async () => {
        await waitFor(() => {
            render(<ConnectedToWallet />, {
                apolloMocks: Default.parameters?.apolloClient.mocks,
                preloadedState,
            });
            fireEvent.click(screen.getByText('Advanced'));
        });
        expect(screen.getByRole('slider')).toHaveValue('0');
        fireEvent.change(screen.getByRole('textbox', { name: 'Amount' }), {
            target: { value: '100' },
        });
        expect(screen.getByRole('slider')).toHaveValue('0');
    });
});
