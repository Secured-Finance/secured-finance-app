import { OrderSide } from '@secured-finance/sf-client';
import { composeStories } from '@storybook/testing-react';
import { preloadedAssetPrices } from 'src/stories/mocks/fixtures';
import { fireEvent, render, screen, waitFor } from 'src/test-utils.js';
import { OrderType } from 'src/types';
import { CurrencySymbol } from 'src/utils';
import timemachine from 'timemachine';
import * as stories from './AdvancedLendingOrderCard.stories';

const { Default } = composeStories(stories);

const preloadedState = {
    landingOrderForm: {
        currency: CurrencySymbol.USDC,
        maturity: 1679665616,
        side: OrderSide.BORROW,
        amount: '500000000',
        unitPrice: 9500,
        orderType: OrderType.LIMIT,
        marketPhase: 'Open',
    },
    wallet: {
        balances: { [CurrencySymbol.USDC]: 10000, [CurrencySymbol.EFIL]: 5000 },
    },
    ...preloadedAssetPrices,
};

beforeEach(() => {
    timemachine.reset();
    timemachine.config({
        dateString: '2022-12-01T00:00:00.00Z',
    });
});

describe('AdvancedLendingOrderCard Component', () => {
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
        expect(screen.getByText('Available: $989.00')).toBeInTheDocument();

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

            expect(screen.getByText('Fixed Rate (APR)')).toBeInTheDocument();
            expect(screen.getByText('16.91%')).toBeInTheDocument();

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
        expect(screen.getByRole('radio', { name: 'Limit' })).not.toHaveClass(
            'hidden'
        );
    });

    it('should show only limit order when in onlyLimitOrder mode', async () => {
        render(<Default onlyLimitOrder />);
        await waitFor(() =>
            expect(screen.queryByRole('radio', { name: 'Market' })).toHaveClass(
                'hidden'
            )
        );

        expect(screen.getByRole('radio', { name: 'Limit' })).not.toHaveClass(
            'hidden'
        );
        expect(screen.getByRole('radio', { name: 'Limit' })).toBeChecked();
        expect(
            screen.getByRole('textbox', { name: 'Bond Price' })
        ).not.toBeDisabled();
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
        expect(screen.getByText('10,000 USDC')).toBeInTheDocument();
    });

    it('should change amount when slider is moved', async () => {
        render(<Default />, {
            preloadedState: {
                ...preloadedState,
                landingOrderForm: {
                    ...preloadedState.landingOrderForm,
                    currency: CurrencySymbol.EFIL,
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
        expect(input).toHaveValue('');
        fireEvent.change(slider, { target: { value: 50 } });
        expect(input).toHaveValue('50');
        fireEvent.change(slider, { target: { value: 100 } });
        expect(input).toHaveValue('100');
    });

    it('should reset amount and slider to 0 when wallet source is changed', async () => {
        await waitFor(() => {
            render(<Default />, {
                preloadedState: {
                    ...preloadedState,
                    landingOrderForm: {
                        ...preloadedState.landingOrderForm,
                        currency: CurrencySymbol.EFIL,
                        side: OrderSide.LEND,
                    },
                },
            });
        });

        const slider = screen.getByRole('slider');
        const input = screen.getByRole('textbox', { name: 'Amount' });
        fireEvent.change(input, { target: { value: '100' } });

        const walletSourceButton = screen.getByTestId(
            'wallet-source-selector-button'
        );
        fireEvent.click(walletSourceButton);
        const option = screen.getByTestId('option-1');
        fireEvent.click(option);

        expect(input).toHaveValue('');
        expect(slider).toHaveValue('0');
    });

    it('slider should move according to source balance', async () => {
        await waitFor(() =>
            render(<Default />, {
                preloadedState: {
                    ...preloadedState,
                    landingOrderForm: {
                        ...preloadedState.landingOrderForm,
                        currency: CurrencySymbol.EFIL,
                        side: OrderSide.LEND,
                    },
                },
            })
        );

        const slider = screen.getByRole('slider');
        const input = screen.getByRole('textbox', { name: 'Amount' });

        expect(screen.getByText('0xB98b...Fd6D')).toBeInTheDocument();
        expect(input).toHaveValue('0.0000');
        fireEvent.change(slider, { target: { value: 100 } });
        expect(input).toHaveValue('5,000');

        const walletSourceButton = screen.getByTestId(
            'wallet-source-selector-button'
        );
        fireEvent.click(walletSourceButton);

        expect(screen.getByText('SF Vault')).toBeInTheDocument();
        const option = screen.getByTestId('option-1');
        fireEvent.click(option);
        expect(input).toHaveValue('');
        fireEvent.change(slider, { target: { value: 100 } });
        expect(input).toHaveValue('100');
    });

    it('it should disable the action button and show error hint if amount is greater than available amount', async () => {
        render(<Default />, {
            preloadedState: {
                ...preloadedState,
                landingOrderForm: {
                    ...preloadedState.landingOrderForm,
                    currency: CurrencySymbol.EFIL,
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
});
