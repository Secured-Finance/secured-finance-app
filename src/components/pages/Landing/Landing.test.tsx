import { OrderSide } from '@secured-finance/sf-client';
import { composeStories } from '@storybook/react';
import { initialStore } from 'src/stories/mocks/mockStore';
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

const preloadedState = {
    ...initialStore,
    wallet: { address: '0x1' },
};

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

    it.skip('should change the rate when the user changes the maturity', async () => {
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

        fireEvent.click(screen.getByRole('button', { name: 'DEC2022' }));
        fireEvent.click(screen.getByText('MAR2023'));
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
        it.skip('should display the best price as bond price when user change to advance mode', async () => {
            await waitFor(() => {
                render(<Default />, {
                    apolloMocks: Default.parameters?.apolloClient.mocks,
                    preloadedState,
                });
            });
            clickAdvancedButton();

            await waitFor(() =>
                expect(screen.getByText('DEC2022')).toBeInTheDocument()
            );
            assertInputValue('Amount', '');
            assertInputValue('Bond Price', '96.85');
        });

        it.skip('should reset bond price when user changes maturity', async () => {
            await waitFor(() => {
                render(<Default />, {
                    apolloMocks: Default.parameters?.apolloClient.mocks,
                    preloadedState,
                });
            });
            clickAdvancedButton();

            expect(await screen.findByText('DEC2022')).toBeInTheDocument();

            assertInputValue('Bond Price', '96.85');

            changeInputValue('Amount', '1');
            changeInputValue('Bond Price', '80');

            fireEvent.click(screen.getByRole('button', { name: 'DEC2022' }));
            fireEvent.click(screen.getByText('MAR2023'));
            expect(await screen.findByText('MAR2023')).toBeInTheDocument();

            assertInputValue('Amount', '1');
            assertInputValue('Bond Price', '96.83');
        });

        it.skip('should reset bond price to the best price when user changes currency', async () => {
            await waitFor(() => {
                render(<ConnectedToWallet />, {
                    apolloMocks: Default.parameters?.apolloClient.mocks,
                    preloadedState,
                });
            });

            clickAdvancedButton();
            await waitFor(() =>
                expect(
                    screen.getByRole('button', { name: 'DEC2022' })
                ).toBeInTheDocument()
            );

            // ensure wallet is connected
            await waitFor(() => {
                expect(screen.getByLabelText('Bond Price')).toBeInTheDocument();
            });

            assertInputValue('Bond Price', '96.85');

            changeInputValue('Amount', '1');
            changeInputValue('Bond Price', '80');

            fireEvent.click(screen.getByRole('button', { name: 'WFIL' }));
            fireEvent.click(screen.getByRole('menuitem', { name: 'USDC' }));

            assertInputValue('Amount', '1');
            assertInputValue('Bond Price', '96.85');
        }, 8000);

        it.skip('should reset bond price to the best price when user changes mode', async () => {
            await waitFor(() => {
                render(<Default />, {
                    apolloMocks: Default.parameters?.apolloClient.mocks,
                    preloadedState,
                });
            });
            clickAdvancedButton();

            expect(await screen.findByText('DEC2022')).toBeInTheDocument();

            assertInputValue('Bond Price', '96.85');
            changeInputValue('Amount', '1');
            changeInputValue('Bond Price', '80');
            clickSimpleButton();
            clickAdvancedButton();
            expect(await screen.findByText('DEC2022')).toBeInTheDocument();

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

    it.skip('should filter out non ready markets', async () => {
        await waitFor(() => {
            render(<Default />, {
                apolloMocks: Default.parameters?.apolloClient.mocks,
                preloadedState,
            });
        });

        expect(await screen.findByText('DEC2022')).toBeInTheDocument();

        fireEvent.click(screen.getByText('DEC2022'));
        expect(screen.getByText('MAR2023')).toBeInTheDocument();
        expect(screen.queryByText('DEC2024')).not.toBeInTheDocument();
    });

    it.skip('should change the amount slider when amount input changes and user has balance', async () => {
        await waitFor(() => {
            render(<ConnectedToWallet />, {
                apolloMocks: Default.parameters?.apolloClient.mocks,
                preloadedState,
            });
        });
        clickAdvancedButton();
        expect(await screen.findByText('DEC2022')).toBeInTheDocument();
        expect(screen.getByRole('slider')).toHaveValue('0');
        fireEvent.click(screen.getByRole('radio', { name: 'Lend' }));
        await waitFor(() =>
            fireEvent.input(screen.getByRole('textbox', { name: 'Amount' }), {
                target: { value: '1000' },
            })
        );
        expect(screen.getByRole('slider')).toHaveValue('10');
        await waitFor(() =>
            fireEvent.input(screen.getByRole('textbox', { name: 'Amount' }), {
                target: { value: '5000' },
            })
        );
        await waitFor(() =>
            expect(screen.getByRole('slider')).toHaveValue('50')
        );
    });

    it.skip('should not change the amount slider when amount input changes and user do not have balance', async () => {
        await waitFor(() => {
            render(<ConnectedToWallet />, {
                apolloMocks: Default.parameters?.apolloClient.mocks,
                preloadedState,
            });
        });
        clickAdvancedButton();
        expect(await screen.findByText('DEC2022')).toBeInTheDocument();
        expect(screen.getByRole('slider')).toHaveValue('0');
        waitFor(() => {
            fireEvent.change(screen.getByRole('textbox', { name: 'Amount' }), {
                target: { value: '100' },
            });
        });

        expect(screen.getByRole('slider')).toHaveValue('0');
    });

    it.skip('should show delisting disclaimer if a currency is being delisted', async () => {
        await waitFor(() => {
            render(<Default />, {
                apolloMocks: Default.parameters?.apolloClient.mocks,
                preloadedState,
            });
        });

        await waitFor(() => {
            expect(
                screen.getByText(
                    'Please note that USDC will be delisted on Secured Finance.'
                )
            ).toBeInTheDocument();
        });
    });

    it.skip('should not show delisting disclaimer if no currency is being delisted', async () => {
        // This test fails sometimes only when all test suites are run.
        jest.spyOn(mock, 'currencyExists').mockResolvedValue(true);
        await waitFor(() => {
            render(<Default />, {
                apolloMocks: Default.parameters?.apolloClient.mocks,
                preloadedState,
            });
        });

        await waitFor(() => {
            expect(
                screen.queryByText(
                    'Please note that USDC will be delisted on Secured Finance.'
                )
            ).not.toBeInTheDocument();
        });
    });

    it('should render the itayose banner for opening of a new market', async () => {
        await waitFor(() => {
            render(<Default />, {
                apolloMocks: Default.parameters?.apolloClient.mocks,
                preloadedState,
            });
        });

        await waitFor(() => {
            expect(
                screen.getByText(
                    'Market WFIL-DEC2024 is open for pre-orders now until May 31, 2023 (UTC)'
                )
            ).toBeInTheDocument();
        });
    }, 8000);
});
