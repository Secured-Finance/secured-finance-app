import { OrderSide } from '@secured-finance/sf-client';
import { composeStories } from '@storybook/react';
import {
    preloadedBalances,
    preloadedLendingMarkets,
} from 'src/stories/mocks/fixtures';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { fireEvent, render, screen, waitFor, within } from 'src/test-utils.js';
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

beforeAll(() => {
    timemachine.reset();
    timemachine.config({
        dateString: '2021-12-01T11:00:00.00Z',
    });
});

describe('Landing Component', () => {
    const clickAdvancedButton = () => {
        fireEvent.click(screen.getByText('Advanced'));
    };

    const clickSimpleButton = () => {
        fireEvent.click(screen.getByText('Simple'));
    };

    const changeInputValue = (label: string, value: string) => {
        const input = screen.getByLabelText(label);
        fireEvent.change(input, { target: { value } });
        expect(input).toHaveValue(value);
    };

    const assertInputValue = (label: string, value: string) => {
        const input = screen.getByLabelText(label);
        expect(input).toHaveValue(value);
    };

    it('should change the rate when the user changes the maturity', async () => {
        render(<Default />, {
            apolloMocks: Default.parameters?.apolloClient.mocks,
            preloadedState: {
                ...preloadedState,
                landingOrderForm: {
                    currency: CurrencySymbol.WFIL,
                    maturity: 1669852800,
                    side: OrderSide.BORROW,
                    amount: '500000000',
                    unitPrice: 9500,
                    orderType: OrderType.LIMIT,
                    marketPhase: 'Open',
                },
            },
        });
        expect(
            await within(screen.getByTestId('market-rate')).findByText('3.26%')
        ).toBeInTheDocument();

        fireEvent.click(screen.getByRole('button', { name: 'DEC22' }));
        fireEvent.click(screen.getByText('MAR23'));
        expect(screen.getByTestId('market-rate')).toHaveTextContent('2.62%');
    });

    it('should select the limit order type when the user change to advance mode', async () => {
        waitFor(() => {
            render(<Default />, {
                apolloMocks: Default.parameters?.apolloClient.mocks,
                preloadedState,
            });
            clickAdvancedButton();
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
            clickAdvancedButton();
        });

        expect(screen.getByRole('radio', { name: 'Limit' })).toBeChecked();

        fireEvent.click(screen.getByRole('radio', { name: 'Market' }));
        expect(screen.getByRole('radio', { name: 'Market' })).toBeChecked();
    });

    describe('Bond Price field', () => {
        it('should display the best price as bond price when user change to advance mode', async () => {
            await waitFor(() => {
                render(<Default />, {
                    apolloMocks: Default.parameters?.apolloClient.mocks,
                    preloadedState,
                });
                clickAdvancedButton();
            });

            assertInputValue('Amount', '');
            assertInputValue('Bond Price', '96.85');
        });

        it('should reset bond price when user changes maturity', async () => {
            await waitFor(() => {
                render(<Default />, {
                    apolloMocks: Default.parameters?.apolloClient.mocks,
                    preloadedState,
                });
                clickAdvancedButton();
            });
            assertInputValue('Bond Price', '96.85');

            changeInputValue('Amount', '1');
            changeInputValue('Bond Price', '80');

            fireEvent.click(screen.getByRole('button', { name: 'DEC22' }));
            fireEvent.click(screen.getByText('MAR23'));
            expect(screen.getByText('MAR23')).toBeInTheDocument();

            assertInputValue('Amount', '1');
            assertInputValue('Bond Price', '96.83');
        });

        it('should reset bond price to the best price when user changes currency', async () => {
            await waitFor(() => {
                render(<Default />, {
                    apolloMocks: Default.parameters?.apolloClient.mocks,
                    preloadedState,
                });
                clickAdvancedButton();
            });
            assertInputValue('Bond Price', '96.85');

            changeInputValue('Amount', '1');
            changeInputValue('Bond Price', '80');

            fireEvent.click(screen.getByRole('button', { name: 'Filecoin' }));
            fireEvent.click(screen.getByRole('menuitem', { name: 'USDC' }));

            assertInputValue('Amount', '1');
            assertInputValue('Bond Price', '96.85');
        });

        it('should reset bond price to the best price when user changes mode', async () => {
            await waitFor(() => {
                render(<Default />, {
                    apolloMocks: Default.parameters?.apolloClient.mocks,
                    preloadedState,
                });
                clickAdvancedButton();
            });
            assertInputValue('Bond Price', '96.85');
            changeInputValue('Amount', '1');
            changeInputValue('Bond Price', '80');
            clickSimpleButton();
            clickAdvancedButton();
            assertInputValue('Bond Price', '96.85');
        });
    });

    it('should open the landing page with the mode set in the store', async () => {
        await waitFor(() => {
            render(<Default />, {
                apolloMocks: Default.parameters?.apolloClient.mocks,
                preloadedState: {
                    ...preloadedState,
                    landingOrderForm: {
                        currency: CurrencySymbol.WFIL,
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
            clickAdvancedButton();
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
        });
        clickAdvancedButton();
        expect(await screen.findByText('DEC22')).toBeInTheDocument();
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
        });
        clickAdvancedButton();
        expect(await screen.findByText('DEC22')).toBeInTheDocument();
        expect(screen.getByRole('slider')).toHaveValue('0');
        fireEvent.change(screen.getByRole('textbox', { name: 'Amount' }), {
            target: { value: '100' },
        });
        expect(screen.getByRole('slider')).toHaveValue('0');
    });
});
