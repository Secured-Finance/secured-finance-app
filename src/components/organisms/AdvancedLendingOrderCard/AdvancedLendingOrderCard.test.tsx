import { OrderSide } from '@secured-finance/sf-client';
import { composeStories } from '@storybook/testing-react';
import { OrderType } from 'src/hooks';
import { preloadedAssetPrices } from 'src/stories/mocks/fixtures';
import { render, screen, waitFor } from 'src/test-utils.js';
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
        await waitFor(() => render(<Default />, { preloadedState }));

        expect(screen.getByTestId('place-order-button')).toHaveTextContent(
            'Place Order'
        );
        expect(screen.getAllByRole('radio')).toHaveLength(4);
        expect(screen.getAllByRole('radiogroup')).toHaveLength(2);
    });

    it('should render CollateralManagementConciseTab', async () => {
        await waitFor(() => render(<Default />, { preloadedState }));

        expect(screen.getByText('Collateral Management')).toBeInTheDocument();
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
        await waitFor(() => render(<Default />, { preloadedState }));

        const inputs = screen.getAllByRole('textbox');
        expect(screen.getByText('Bond Price')).toBeInTheDocument();
        expect(inputs[0].getAttribute('value')).toBe('95');

        expect(screen.getByText('Fixed Rate (APR)')).toBeInTheDocument();
        expect(screen.getByText('17%')).toBeInTheDocument();

        expect(screen.getByText('Amount')).toBeInTheDocument();
        expect(inputs[1].getAttribute('value')).toBe('500');
        expect(screen.getByText('USDC')).toBeInTheDocument();

        expect(screen.getByText('Est. Present Value')).toBeInTheDocument();
        expect(screen.getByText('$500.00')).toBeInTheDocument();
        expect(screen.getByText('Future Value')).toBeInTheDocument();
    });

    it('should display the PlaceOrder Dialog when clicking on the Place Order button', async () => {
        await waitFor(() => render(<Default />, { preloadedState }));
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        screen.getByTestId('place-order-button').click();
        expect(
            screen.getByRole('dialog', {
                name: 'Confirm Order',
            })
        ).toBeInTheDocument();
    });

    it('should show a button to manage collateral', async () => {
        await waitFor(() => render(<Default />));
        expect(
            screen.getByRole('button', { name: 'Manage »' })
        ).toBeInTheDocument();
    });

    it('should show both market and limit order when in default mode', async () => {
        await waitFor(() => render(<Default />, { preloadedState }));
        expect(screen.getByRole('radio', { name: 'Market' })).not.toHaveClass(
            'hidden'
        );
        expect(screen.getByRole('radio', { name: 'Limit' })).not.toHaveClass(
            'hidden'
        );
    });

    it('should show only limit order when in onlyLimitOrder mode', async () => {
        await waitFor(() =>
            render(<Default onlyLimitOrder />, {
                preloadedState: {
                    ...preloadedState,
                    landingOrderForm: {
                        ...preloadedState.landingOrderForm,
                    },
                },
            })
        );
        expect(screen.queryByRole('radio', { name: 'Market' })).toHaveClass(
            'hidden'
        );
        expect(screen.getByRole('radio', { name: 'Limit' })).not.toHaveClass(
            'hidden'
        );
    });
});
