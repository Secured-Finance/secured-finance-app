import { composeStories } from '@storybook/testing-react';
import { OrderSide, OrderType } from 'src/hooks';
import { preloadedAssetPrices } from 'src/stories/mocks/fixtures';
import { render, screen } from 'src/test-utils.js';
import { CurrencySymbol } from 'src/utils';
import * as stories from './MarketDashboardOrderCard.stories';

const { Default } = composeStories(stories);

const preloadedState = {
    marketDashboardForm: {
        currency: CurrencySymbol.BTC,
        maturity: '0',
        side: OrderSide.Borrow,
        amount: '1200000000',
        rate: 10000,
        orderType: OrderType.LIMIT,
    },
    ...preloadedAssetPrices,
};

describe('MarketDashboardOrderCard Component', () => {
    it('should render a MarketDashboardOrderCard', () => {
        render(<Default />);
        expect(screen.getByTestId('place-order-button')).toHaveTextContent(
            'Place Order'
        );
        expect(screen.getAllByRole('radio')).toHaveLength(5);
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
        expect(screen.getByText('Fixed Rate')).toBeInTheDocument();
        expect(inputs[0].getAttribute('value')).toBe('1');

        expect(screen.getByText('Amount')).toBeInTheDocument();
        expect(inputs[1].getAttribute('value')).toBe('12');
        expect(screen.getByText('BTC')).toBeInTheDocument();

        expect(screen.getByText('Total')).toBeInTheDocument();
        expect(screen.getByText('600,000')).toBeInTheDocument();
        expect(screen.getByText('USD')).toBeInTheDocument();
    });
});
