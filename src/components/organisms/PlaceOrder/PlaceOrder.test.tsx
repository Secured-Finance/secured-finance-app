import { OrderSide, WalletSource } from '@secured-finance/sf-client';
import { composeStories } from '@storybook/testing-react';
import { BigNumber } from 'ethers';
import { dec22Fixture, preloadedAssetPrices } from 'src/stories/mocks/fixtures';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { fireEvent, render, screen, waitFor } from 'src/test-utils.js';
import { OrderType } from 'src/types';
import { CurrencySymbol } from 'src/utils';
import * as stories from './PlaceOrder.stories';

const { Default } = composeStories(stories);

const preloadedState = {
    landingOrderForm: {
        currency: CurrencySymbol.USDC,
        maturity: 0,
        side: OrderSide.BORROW,
        amount: '500000000',
        unitPrice: 0,
        orderType: OrderType.LIMIT,
        sourceAccount: WalletSource.METAMASK,
    },
    ...preloadedAssetPrices,
};

const mockSecuredFinance = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mockSecuredFinance);

describe('PlaceOrder component', () => {
    it('should display the Place Order Modal when open', async () => {
        render(<Default />);

        await waitFor(() => {
            expect(screen.getByRole('dialog')).toBeInTheDocument();
        });
        expect(screen.getByText('Confirm Order')).toBeInTheDocument();
        const button = screen.getByTestId('dialog-action-button');
        expect(button).toHaveTextContent('OK');
    });

    it('should display the borrow remaining and the collateral usage if its a BORROW order', async () => {
        render(<Default />);

        await waitFor(() => {
            expect(screen.getByText('Borrow Amount')).toBeInTheDocument();
        });
        expect(screen.getByText('100 USDC')).toBeInTheDocument();
        expect(screen.getByText('Borrow Remaining')).toBeInTheDocument();
        expect(screen.getByText('$291.15')).toBeInTheDocument();
        expect(screen.getByText('Bond Price')).toBeInTheDocument();
        expect(screen.getByText('~ 94.10')).toBeInTheDocument();
        expect(screen.getByText('APR')).toBeInTheDocument();
        expect(screen.getByText('~ 6.28%')).toBeInTheDocument();
    });

    it('should render collateral utilization in borrow orders', async () => {
        render(<Default />);

        await waitFor(() => {
            expect(screen.getByText('Collateral Usage')).toBeInTheDocument();
        });
        expect(screen.getByText('37%')).toBeInTheDocument();
        expect(screen.getByText('37%')).toHaveClass('text-progressBarStart');
        expect(screen.getByText('66.14%')).toBeInTheDocument();
        expect(screen.getByText('66.14%')).toHaveClass('text-progressBarEnd');
    });

    it('should display the circuit breaker disclaimer', async () => {
        render(<Default />);

        await waitFor(() => {
            expect(screen.getByTestId('disclaimer-button')).toBeInTheDocument();
        });
        const button = screen.getByTestId('disclaimer-button');
        expect(button).toHaveTextContent('Circuit Breaker Disclaimer');
        await waitFor(() => fireEvent.click(button));
        expect(
            screen.getByText(
                'Circuit breaker will be triggered if the order is filled at over the max slippage level at 1 block.'
            )
        ).toBeInTheDocument();
    });

    it('should not display the borrow remaining and the collateral usage if its a LEND order', async () => {
        render(<Default side={OrderSide.LEND} />);

        await waitFor(() => {
            expect(screen.getByText('Lend Amount')).toBeInTheDocument();
        });
        expect(screen.getByText('100 USDC')).toBeInTheDocument();
        expect(screen.queryByText('Borrow Remaining')).not.toBeInTheDocument();
        expect(screen.queryByText('Collateral Usage')).not.toBeInTheDocument();

        expect(screen.getByText('Bond Price')).toBeInTheDocument();
        expect(screen.getByText('~ 94.10')).toBeInTheDocument();
        expect(screen.getByText('APR')).toBeInTheDocument();
        expect(screen.getByText('~ 6.28%')).toBeInTheDocument();
    });

    it('should reach success screen when transaction receipt is received', async () => {
        const onClose = jest.fn();
        const tx = {
            wait: jest.fn(() => Promise.resolve({ blockNumber: 13115215 })),
        } as unknown;
        const onPlaceOrder = jest.fn().mockReturnValue(Promise.resolve(tx));

        render(<Default onClose={onClose} onPlaceOrder={onPlaceOrder} />, {
            preloadedState,
        });
        fireEvent.click(screen.getByTestId('dialog-action-button'));

        await waitFor(() =>
            expect(screen.getByText('Success!')).toBeInTheDocument()
        );

        await waitFor(() =>
            expect(
                screen.getByText('Your transaction request was successful.')
            ).toBeInTheDocument()
        );

        await waitFor(() => expect(onClose).not.toHaveBeenCalled());
    });

    it('should write an error in the store and proceed to failure screen if onPlaceOrder throw an error', async () => {
        const onPlaceOrder = jest.fn(() => {
            throw new Error('This is an error');
        });
        const { store } = render(<Default onPlaceOrder={onPlaceOrder} />);
        fireEvent.click(screen.getByTestId('dialog-action-button'));
        await waitFor(() =>
            expect(store.getState().lastError.lastMessage).toEqual(
                'This is an error'
            )
        );
        expect(screen.getByText('Failed!')).toBeInTheDocument();
        expect(screen.getByText('This is an error')).toBeInTheDocument();
    });

    it('should call the onPlaceOrder function in market order mode if the orderType is MARKET', async () => {
        const tx = {
            wait: jest.fn(() => Promise.resolve({ blockNumber: 13115215 })),
        } as unknown;
        const onPlaceOrder = jest.fn().mockReturnValue(Promise.resolve(tx));
        render(
            <Default
                onPlaceOrder={onPlaceOrder}
                orderType={OrderType.MARKET}
            />,
            { preloadedState }
        );
        fireEvent.click(screen.getByTestId('dialog-action-button'));
        await waitFor(() =>
            expect(onPlaceOrder).toHaveBeenCalledWith(
                CurrencySymbol.USDC,
                dec22Fixture,
                OrderSide.BORROW,
                BigNumber.from('100000000'),
                0,
                WalletSource.METAMASK
            )
        );
    });

    it('should call the onPlaceOrder function in limit order mode if the orderType is LIMIT', async () => {
        const tx = {
            wait: jest.fn(() => Promise.resolve({ blockNumber: 13115215 })),
        } as unknown;
        const onPlaceOrder = jest.fn().mockReturnValue(Promise.resolve(tx));
        render(
            <Default onPlaceOrder={onPlaceOrder} orderType={OrderType.LIMIT} />,
            { preloadedState }
        );
        fireEvent.click(screen.getByTestId('dialog-action-button'));
        await waitFor(() =>
            expect(onPlaceOrder).toHaveBeenCalledWith(
                CurrencySymbol.USDC,
                dec22Fixture,
                OrderSide.BORROW,
                BigNumber.from('100000000'),
                9410,
                WalletSource.METAMASK
            )
        );
    });

    it('should raise an error if the order price is missing but we are in a limit order mode', async () => {
        const onPlaceOrder = jest.fn();
        const spy = jest.spyOn(console, 'error').mockImplementation();
        render(<Default onPlaceOrder={onPlaceOrder} loanValue={undefined} />, {
            preloadedState,
        });
        fireEvent.click(screen.getByTestId('dialog-action-button'));
        await waitFor(() => expect(spy).toHaveBeenCalled());
        await waitFor(() => expect(onPlaceOrder).not.toHaveBeenCalled());
    });
});
