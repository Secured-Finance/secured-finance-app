import { Side } from '@secured-finance/sf-client/dist/secured-finance-client';
import { composeStories } from '@storybook/testing-react';
import { OrderType } from 'src/hooks';
import { preloadedAssetPrices } from 'src/stories/mocks/fixtures';
import { render, screen } from 'src/test-utils.js';
import { CurrencySymbol } from 'src/utils';
import * as stories from './AdvancedLendingOrderCard.stories';

const { Default } = composeStories(stories);

const preloadedState = {
    landingOrderForm: {
        currency: CurrencySymbol.BTC,
        maturity: 0,
        side: Side.BORROW,
        amount: '1200000000',
        unitPrice: 0,
        orderType: OrderType.LIMIT,
    },
    ...preloadedAssetPrices,
};

describe('AdvancedLendingOrderCard Component', () => {
    it('should render an AdvancedLendingOrderCard', () => {
        render(<Default />);
        expect(screen.getByTestId('place-order-button')).toHaveTextContent(
            'Place Order'
        );
        expect(screen.getAllByRole('radio')).toHaveLength(4);
        expect(screen.getAllByRole('radiogroup')).toHaveLength(2);
    });

    it('should render collateralmanagementconcisetab', () => {
        render(<Default />);
        expect(screen.getByText('Collateral Management')).toBeInTheDocument();
        expect(screen.getByText('Collateral')).toBeInTheDocument();
        expect(screen.getByText('Utilization 8%')).toBeInTheDocument();
        expect(screen.getByText('$80')).toBeInTheDocument();

        expect(screen.getByText('Liquidation Risk')).toBeInTheDocument();
        expect(screen.getByText('Threshold 72%')).toBeInTheDocument();
        expect(screen.getByText('Low')).toBeInTheDocument();

        expect(screen.getByTestId('collateral-progress-bar-track')).toHaveStyle(
            'width: calc(100% * 0.08)'
        );
    });

    it('should render order form', () => {
        render(<Default />, { preloadedState });

        const inputs = screen.getAllByRole('textbox');
        expect(screen.getByText('Unit Price')).toBeInTheDocument();
        expect(inputs[0].getAttribute('value')).toBe('0');

        expect(screen.getByText('Amount')).toBeInTheDocument();
        expect(inputs[1].getAttribute('value')).toBe('12');
        expect(screen.getByText('BTC')).toBeInTheDocument();

        expect(screen.getByText('Total')).toBeInTheDocument();
        expect(screen.getByText('600,000')).toBeInTheDocument();
        expect(screen.getByText('USD')).toBeInTheDocument();
    });

    it('should display the PlaceOrder Dialog when clicking on the Place Order button', () => {
        render(<Default />, { preloadedState });
        expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
        screen.getByTestId('place-order-button').click();
        expect(
            screen.getByRole('dialog', {
                name: 'Confirm Order',
            })
        ).toBeInTheDocument();
    });
});
