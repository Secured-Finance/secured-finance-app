import { OrderSide } from '@secured-finance/sf-client';
import { composeStories } from '@storybook/testing-react';
import { OrderType } from 'src/hooks';
import { preloadedAssetPrices } from 'src/stories/mocks/fixtures';
import { render, screen, waitFor } from 'src/test-utils.js';
import { CurrencySymbol } from 'src/utils';
import * as stories from './AdvancedLendingOrderCard.stories';

const { Default } = composeStories(stories);

const preloadedState = {
    landingOrderForm: {
        currency: CurrencySymbol.USDC,
        maturity: 0,
        side: OrderSide.BORROW,
        amount: '500000000',
        unitPrice: 0,
        orderType: OrderType.LIMIT,
    },
    ...preloadedAssetPrices,
};

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
        expect(screen.getByText('Available: $851.00')).toBeInTheDocument();

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
        expect(screen.getByText('Unit Price')).toBeInTheDocument();
        expect(inputs[0].getAttribute('value')).toBe('0');

        expect(screen.getByText('Amount')).toBeInTheDocument();
        expect(inputs[1].getAttribute('value')).toBe('500');
        expect(screen.getByText('USDC')).toBeInTheDocument();

        expect(screen.getByText('Total')).toBeInTheDocument();
        expect(screen.getByText('500')).toBeInTheDocument();
        expect(screen.getByText('USD')).toBeInTheDocument();
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
            screen.getByRole('button', { name: 'Manage >>' })
        ).toBeInTheDocument();
    });
});
