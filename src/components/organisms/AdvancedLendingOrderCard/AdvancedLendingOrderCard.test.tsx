import { OrderSide } from '@secured-finance/sf-client';
import { composeStories } from '@storybook/react';
import { BigNumber } from 'ethers';
import { CollateralBook } from 'src/hooks';
import { dec22Fixture, preloadedAssetPrices } from 'src/stories/mocks/fixtures';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { fireEvent, render, screen, waitFor } from 'src/test-utils.js';
import { OrderType } from 'src/types';
import { CurrencySymbol } from 'src/utils';
import timemachine from 'timemachine';
import * as stories from './AdvancedLendingOrderCard.stories';

const { Default } = composeStories(stories);

const preloadedState = {
    landingOrderForm: {
        currency: CurrencySymbol.USDC,
        maturity: dec22Fixture,
        side: OrderSide.BORROW,
        amount: '500000000',
        unitPrice: 9500,
        orderType: OrderType.LIMIT,
    },
    wallet: {
        address: '0x1',
    },
    ...preloadedAssetPrices,
};

const collateralBook0: CollateralBook = {
    collateral: {
        ETH: BigNumber.from('1000000000000000000'),
        USDC: BigNumber.from('10000000'),
        WBTC: BigNumber.from('20000000'),
    },
    nonCollateral: {
        WFIL: BigNumber.from('100000000000000000000'),
    },
    usdCollateral: 12100.34,
    usdNonCollateral: 600,
    coverage: BigNumber.from('0'),
    collateralThreshold: 80,
    withdrawableCollateral: {
        [CurrencySymbol.USDC]: BigNumber.from(100000),
        [CurrencySymbol.ETH]: BigNumber.from(100000),
    },
};

beforeEach(() => {
    timemachine.reset();
    timemachine.config({
        dateString: '2022-02-01T11:00:00.00Z',
    });
});

const mockSecuredFinance = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mockSecuredFinance);

describe.skip('AdvancedLendingOrderCard Component', () => {
    const changeInputValue = (label: string, value: string) => {
        const input = screen.getByLabelText(label);
        fireEvent.change(input, { target: { value } });
    };

    it('should render an AdvancedLendingOrderCard', async () => {
        render(<Default />, { preloadedState });
        await waitFor(() =>
            expect(screen.getByTestId('place-order-button')).toHaveTextContent(
                'Place Order'
            )
        );
        expect(screen.getAllByRole('radio')).toHaveLength(4);
        expect(screen.getAllByRole('radiogroup')).toHaveLength(2);
    });

    it('should show the rate computed from the bond price', async () => {
        render(<Default />, { preloadedState });
        expect(await screen.findByText('6.35%')).toBeInTheDocument();
    });

    it('should render CollateralManagementConciseTab', async () => {
        render(<Default />, { preloadedState });
        await waitFor(() =>
            expect(
                screen.getByText('Collateral Management')
            ).toBeInTheDocument()
        );
        expect(screen.getByText('Collateral Utilization')).toBeInTheDocument();
        expect(screen.getByText('37%')).toBeInTheDocument();
        expect(screen.getByTestId('collateral-progress-bar-track')).toHaveStyle(
            'width: calc(100% * 0.37)'
        );
        expect(screen.getByText('Available: $5,203.15')).toBeInTheDocument();

        expect(screen.getByText('Liquidation Risk')).toBeInTheDocument();
        expect(screen.getByText('Low')).toBeInTheDocument();
        expect(screen.getByText('Low')).toHaveClass('text-progressBarStart');
        expect(screen.getByText('Threshold: 43%')).toBeInTheDocument();
        expect(screen.getByTestId('liquidation-progress-bar-tick')).toHaveStyle(
            'width: calc(100% * 0.37 + 4px )'
        );
    });

    it('should render order form', async () => {
        render(<Default />, { preloadedState });
        await waitFor(() => {
            const inputs = screen.getAllByRole('textbox');
            expect(screen.getByText('Bond Price')).toBeInTheDocument();
            expect(inputs[0].getAttribute('value')).toBe('95');

            expect(screen.getByText('Amount')).toBeInTheDocument();
            expect(inputs[1].getAttribute('value')).toBe('500');
            expect(screen.getByText('USDC')).toBeInTheDocument();
        });

        expect(screen.getByText('Est. Present Value')).toBeInTheDocument();
        expect(screen.getByText('$500.00')).toBeInTheDocument();
        expect(screen.getByText('Future Value')).toBeInTheDocument();
    });

    it('should display the PlaceOrder Dialog when clicking on the Place Order button', async () => {
        render(<Default />, { preloadedState });
        await waitFor(() =>
            expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
        );
        await waitFor(() =>
            expect(screen.getByTestId('place-order-button')).toBeInTheDocument()
        );
        screen.getByTestId('place-order-button').click();
        expect(
            screen.getByRole('dialog', {
                name: 'Confirm Order',
            })
        ).toBeInTheDocument();
    });

    it('should show a button to manage collateral', async () => {
        render(<Default />);
        await waitFor(() =>
            expect(
                screen.getByRole('button', { name: 'Manage »' })
            ).toBeInTheDocument()
        );
    });

    it('should show both market and limit order when in default mode', async () => {
        render(<Default />, { preloadedState });
        await waitFor(() =>
            expect(
                screen.getByRole('radio', { name: 'Market' })
            ).not.toHaveClass('hidden')
        );
        expect(screen.getByRole('radio', { name: 'Market' })).not.toBeChecked();
        expect(screen.getByRole('radio', { name: 'Limit' })).not.toHaveClass(
            'hidden'
        );
        expect(screen.getByRole('radio', { name: 'Limit' })).toBeChecked();
    });

    it('should hide both market and limit order when in onlyLimitOrder mode', async () => {
        render(<Default onlyLimitOrder />);
        await waitFor(() =>
            expect(
                screen.queryByRole('radio', { name: 'Market' })
            ).not.toBeInTheDocument()
        );

        expect(
            screen.queryByRole('radio', { name: 'Limit' })
        ).not.toBeInTheDocument();
    });

    it('place order button should be disabled if amount is zero', async () => {
        render(<Default />, { preloadedState });

        await waitFor(() => {
            const button = screen.getByTestId('place-order-button');
            expect(button).toBeInTheDocument();
            expect(screen.getByText('Place Order')).toBeInTheDocument();
            const input = screen.getByRole('textbox', { name: 'Amount' });
            fireEvent.change(input, { target: { value: '0' } });
            expect(button).toBeDisabled();
        });
    });

    it('should render wallet source when side is lend', async () => {
        render(<Default />, { preloadedState });
        const lendTab = screen.getByText('Lend');
        fireEvent.click(lendTab);
        await waitFor(() =>
            expect(screen.getByText('Lending Source')).toBeInTheDocument()
        );
        await waitFor(() =>
            expect(screen.getByText('4,000')).toBeInTheDocument()
        );

        const walletSourceButton = screen.getByTestId(
            'wallet-source-selector-button'
        );
        fireEvent.click(walletSourceButton);

        expect(screen.getByText('SF Vault')).toBeInTheDocument();
        const option = screen.getByTestId('option-1');
        fireEvent.click(option);
        expect(screen.getByText('0.1')).toBeInTheDocument();
    });

    it('should change amount when slider is moved', async () => {
        render(<Default />, {
            preloadedState: {
                ...preloadedState,
                landingOrderForm: {
                    ...preloadedState.landingOrderForm,
                    currency: CurrencySymbol.WFIL,
                    side: OrderSide.LEND,
                },
            },
        });

        await waitFor(() => {
            const walletSourceButton = screen.getByTestId(
                'wallet-source-selector-button'
            );
            fireEvent.click(walletSourceButton);
        });

        expect(screen.getByText('SF Vault')).toBeInTheDocument();
        const option = screen.getByTestId('option-1');
        fireEvent.click(option);

        const slider = screen.getByRole('slider');
        const input = screen.getByRole('textbox', { name: 'Amount' });
        fireEvent.change(slider, { target: { value: 50 } });
        expect(input).toHaveValue('50');
        fireEvent.change(slider, { target: { value: 100 } });
        expect(input).toHaveValue('100');
    });

    it('should not reset amount and slider to 0 when wallet source is changed', async () => {
        await waitFor(() => {
            render(<Default />, {
                preloadedState: {
                    ...preloadedState,
                    landingOrderForm: {
                        ...preloadedState.landingOrderForm,
                        currency: CurrencySymbol.WFIL,
                        side: OrderSide.LEND,
                    },
                },
            });
        });

        const slider = screen.getByRole('slider');
        const input = screen.getByRole('textbox', { name: 'Amount' });
        fireEvent.change(input, { target: { value: '50' } });

        await waitFor(() =>
            expect(
                screen.getByTestId('wallet-source-selector-button')
            ).toBeInTheDocument()
        );

        const walletSourceButton = screen.getByTestId(
            'wallet-source-selector-button'
        );
        fireEvent.click(walletSourceButton);
        const option = screen.getByTestId('option-1');
        fireEvent.click(option);

        expect(input).toHaveValue('50');
        expect(slider).toHaveValue('50');
    });

    it('slider should move according to source balance', async () => {
        await waitFor(() =>
            render(<Default />, {
                preloadedState: {
                    ...preloadedState,
                    landingOrderForm: {
                        ...preloadedState.landingOrderForm,
                        currency: CurrencySymbol.WFIL,
                        side: OrderSide.LEND,
                    },
                },
            })
        );

        const slider = screen.getByRole('slider');
        const input = screen.getByRole('textbox', { name: 'Amount' });

        await waitFor(() =>
            expect(screen.getByText('0xB98b...Fd6D')).toBeInTheDocument()
        );
        expect(input).toHaveValue('0.0000');
        fireEvent.change(slider, { target: { value: 100 } });
        expect(input).toHaveValue('10,000');
        fireEvent.change(slider, { target: { value: 1 } });
        expect(input).toHaveValue('100');

        const walletSourceButton = screen.getByTestId(
            'wallet-source-selector-button'
        );
        fireEvent.click(walletSourceButton);

        expect(screen.getByText('SF Vault')).toBeInTheDocument();
        const option = screen.getByTestId('option-1');
        fireEvent.click(option);
        expect(input).toHaveValue('100');
        expect(slider).toHaveValue('100');
        fireEvent.change(slider, { target: { value: 10 } });
        expect(input).toHaveValue('10');
        fireEvent.change(slider, { target: { value: 50 } });
        expect(input).toHaveValue('50');
    });

    it('amount should be set to max wallet amount if input amount is greater than wallet amount and wallet source is changed', async () => {
        await waitFor(() =>
            render(<Default />, {
                preloadedState: {
                    ...preloadedState,
                    landingOrderForm: {
                        ...preloadedState.landingOrderForm,
                        currency: CurrencySymbol.WFIL,
                        side: OrderSide.LEND,
                    },
                },
            })
        );

        const slider = screen.getByRole('slider');
        const input = screen.getByRole('textbox', { name: 'Amount' });

        await waitFor(() =>
            expect(screen.getByText('0xB98b...Fd6D')).toBeInTheDocument()
        );
        expect(input).toHaveValue('0.0000');
        fireEvent.change(slider, { target: { value: 100 } });
        expect(input).toHaveValue('10,000');

        const walletSourceButton = screen.getByTestId(
            'wallet-source-selector-button'
        );
        fireEvent.click(walletSourceButton);

        expect(screen.getByText('SF Vault')).toBeInTheDocument();
        const option = screen.getByTestId('option-1');
        fireEvent.click(option);
        expect(input).toHaveValue('100');
        expect(slider).toHaveValue('100');
    });

    it('it should disable the action button and show error hint if amount is greater than available amount', async () => {
        render(<Default />, {
            preloadedState: {
                ...preloadedState,
                landingOrderForm: {
                    ...preloadedState.landingOrderForm,
                    currency: CurrencySymbol.WFIL,
                    side: OrderSide.LEND,
                },
            },
        });
        await waitFor(() => {
            const input = screen.getByRole('textbox', { name: 'Amount' });
            fireEvent.change(input, { target: { value: '200' } });

            const button = screen.getByTestId('place-order-button');
            expect(button).not.toBeDisabled();
            expect(
                screen.queryByText('Insufficient amount in source')
            ).not.toBeInTheDocument();

            fireEvent.change(input, { target: { value: '20000' } });

            expect(button).toBeDisabled();
            expect(
                screen.queryByText('Insufficient amount in source')
            ).toBeInTheDocument();
        });
    });

    it('should not disable button in Borrow orders when input is less than available to borrow amount', async () => {
        // SF vault has 100 WFIL
        // test asserts that the validation condition for Lend orders i.e (input amount< balance to lend) is not applicable to borrow orders

        render(<Default collateralBook={collateralBook0} />, {
            preloadedState: {
                ...preloadedState,
                landingOrderForm: {
                    ...preloadedState.landingOrderForm,
                    currency: CurrencySymbol.WFIL,
                },
            },
        });
        await waitFor(() => {
            const input = screen.getByRole('textbox', { name: 'Amount' });
            fireEvent.change(input, { target: { value: '1000' } });
        });

        await waitFor(() =>
            expect(screen.getByTestId('place-order-button')).not.toBeDisabled()
        );
    });

    describe('Error handling for invalid bond price in different order types and sides', () => {
        const assertPlaceOrderButtonIsDisabled = () => {
            const button = screen.getByTestId('place-order-button');
            expect(button).toBeInTheDocument();
            expect(button).toBeDisabled();
        };

        const assertPlaceOrderButtonIsEnabled = () => {
            const button = screen.getByTestId('place-order-button');
            expect(button).toBeInTheDocument();
            expect(button).not.toBeDisabled();
        };

        const assertInvalidBondPriceErrorIsShown = () => {
            expect(screen.getByText('Invalid bond price')).toBeInTheDocument();
        };

        const assertInvalidBondPriceErrorIsNotShown = () => {
            expect(
                screen.queryByText('Invalid bond price')
            ).not.toBeInTheDocument();
        };

        describe('LIMIT orders', () => {
            it('should show error, place order button should be disabled if bond price is 0 for borrow order', async () => {
                render(<Default />, {
                    preloadedState: {
                        ...preloadedState,
                        landingOrderForm: {
                            ...preloadedState.landingOrderForm,
                            side: OrderSide.BORROW,
                            orderType: OrderType.LIMIT,
                        },
                    },
                });
                await waitFor(() =>
                    expect(screen.getByText('Place Order')).toBeInTheDocument()
                );

                changeInputValue('Bond Price', '0');
                changeInputValue('Amount', '10');
                assertPlaceOrderButtonIsDisabled();
                assertInvalidBondPriceErrorIsShown();

                changeInputValue('Bond Price', '10');
                assertPlaceOrderButtonIsEnabled();
                assertInvalidBondPriceErrorIsNotShown();
            });

            it('should show error, place order button should be disabled if bond price is 0 for lend order', async () => {
                render(<Default />, {
                    preloadedState: {
                        ...preloadedState,
                        landingOrderForm: {
                            ...preloadedState.landingOrderForm,
                            side: OrderSide.LEND,
                            orderType: OrderType.LIMIT,
                        },
                    },
                });
                await waitFor(() =>
                    expect(screen.getByText('4,000')).toBeInTheDocument()
                );
                changeInputValue('Bond Price', '0');
                changeInputValue('Amount', '10');
                assertPlaceOrderButtonIsDisabled();
                assertInvalidBondPriceErrorIsShown();

                changeInputValue('Bond Price', '10');
                assertPlaceOrderButtonIsEnabled();
                assertInvalidBondPriceErrorIsNotShown();
            });

            it('should not show error, place order button should be disabled if bond price is undefined for borrow orders', async () => {
                render(<Default />, {
                    preloadedState: {
                        ...preloadedState,
                        landingOrderForm: {
                            ...preloadedState.landingOrderForm,
                            unitPrice: undefined,
                        },
                    },
                });

                changeInputValue('Amount', '10');
                assertPlaceOrderButtonIsDisabled();
                assertInvalidBondPriceErrorIsNotShown();

                changeInputValue('Bond Price', '0');
                assertPlaceOrderButtonIsDisabled();
                assertInvalidBondPriceErrorIsShown();
            });

            it('should not show error, place order button should be disabled if bond price is undefined for lend orders', async () => {
                render(<Default />, {
                    preloadedState: {
                        ...preloadedState,
                        landingOrderForm: {
                            ...preloadedState.landingOrderForm,
                            side: OrderSide.LEND,
                            unitPrice: undefined,
                        },
                    },
                });

                changeInputValue('Amount', '10');
                assertPlaceOrderButtonIsDisabled();
                assertInvalidBondPriceErrorIsNotShown();

                changeInputValue('Bond Price', '0');
                assertPlaceOrderButtonIsDisabled();
                assertInvalidBondPriceErrorIsShown();
            });
        });

        describe('MARKET orders', () => {
            it('should not show error, place order button should not be disabled if bond price is 0 for borrow orders', async () => {
                render(<Default />, {
                    preloadedState: {
                        ...preloadedState,
                        landingOrderForm: {
                            ...preloadedState.landingOrderForm,
                            orderType: OrderType.MARKET,
                        },
                    },
                });
                await waitFor(() =>
                    expect(screen.getByText('Place Order')).toBeInTheDocument()
                );

                changeInputValue('Amount', '10');
                assertPlaceOrderButtonIsEnabled();
                assertInvalidBondPriceErrorIsNotShown();
            });

            it('should not show error, place order button should not be disabled if bond price is 0 for lend orders', async () => {
                render(<Default />, {
                    preloadedState: {
                        ...preloadedState,
                        landingOrderForm: {
                            ...preloadedState.landingOrderForm,
                            side: OrderSide.LEND,
                            orderType: OrderType.MARKET,
                        },
                    },
                });
                await waitFor(() =>
                    expect(screen.getByText('4,000')).toBeInTheDocument()
                );
                changeInputValue('Amount', '10');
                assertPlaceOrderButtonIsEnabled();
                assertInvalidBondPriceErrorIsNotShown();
            });

            it('should not show error, place order button should not be disabled if bond price is undefined in MARKET orders', async () => {
                render(<Default />, {
                    preloadedState: {
                        ...preloadedState,
                        landingOrderForm: {
                            ...preloadedState.landingOrderForm,
                            orderType: OrderType.MARKET,
                            unitPrice: undefined,
                        },
                    },
                });
                await waitFor(() =>
                    expect(screen.getByText('Place Order')).toBeInTheDocument()
                );
                changeInputValue('Amount', '10');
                assertPlaceOrderButtonIsEnabled();
                assertInvalidBondPriceErrorIsNotShown();
            });
        });
    });

    describe('bond price input', () => {
        const assertBondPriceInputValue = (expectedValue: string) => {
            const input = screen.getByLabelText('Bond Price');
            expect(input).toHaveAttribute('value', expectedValue);
        };

        it('should show the market price when market price is defined and unit price is undefined', () => {
            render(<Default marketPrice={9600} />, {
                preloadedState: {
                    ...preloadedState,
                    landingOrderForm: {
                        ...preloadedState.landingOrderForm,
                        orderType: OrderType.LIMIT,
                        unitPrice: undefined,
                    },
                },
            });

            assertBondPriceInputValue('96');
        });

        it('should show the bond price as undefined when market price and unit price are undefined', () => {
            render(<Default marketPrice={undefined} />, {
                preloadedState: {
                    ...preloadedState,
                    landingOrderForm: {
                        ...preloadedState.landingOrderForm,
                        orderType: OrderType.LIMIT,
                        unitPrice: undefined,
                    },
                },
            });

            assertBondPriceInputValue('');
        });

        it('should show the unit price when market price and unit price are defined', () => {
            render(<Default marketPrice={9600} />, {
                preloadedState: {
                    ...preloadedState,
                    landingOrderForm: {
                        ...preloadedState.landingOrderForm,
                        orderType: OrderType.LIMIT,
                        unitPrice: 9200,
                    },
                },
            });
            assertBondPriceInputValue('92');
        });

        it('should be reset to market price when changing order type from LIMIT to MARKET', () => {
            render(<Default marketPrice={9600} />, {
                preloadedState: {
                    ...preloadedState,
                    landingOrderForm: {
                        ...preloadedState.landingOrderForm,
                        orderType: OrderType.LIMIT,
                        unitPrice: 9200,
                    },
                },
            });
            assertBondPriceInputValue('92');

            fireEvent.click(screen.getByText('Market'));
            expect(screen.getByText('96')).toBeInTheDocument();
        });

        it('should calculate the APR from the user input bond price', async () => {
            render(<Default marketPrice={9600} />, {
                preloadedState: {
                    ...preloadedState,
                    landingOrderForm: {
                        ...preloadedState.landingOrderForm,
                        orderType: OrderType.LIMIT,
                    },
                },
            });

            expect(await screen.findByText('6.35%')).toBeInTheDocument();
            changeInputValue('Bond Price', '94');
            expect(screen.getByText('7.70%')).toBeInTheDocument();
        });
    });
});
