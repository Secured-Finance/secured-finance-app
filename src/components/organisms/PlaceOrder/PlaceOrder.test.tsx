import { OrderSide, WalletSource } from '@secured-finance/sf-client';
import { composeStories } from '@storybook/react';
import { dec22Fixture, preloadedAssetPrices } from 'src/stories/mocks/fixtures';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { fireEvent, render, screen, waitFor } from 'src/test-utils.js';
import { OrderType } from 'src/types';
import { CurrencySymbol } from 'src/utils';
import * as stories from './PlaceOrder.stories';

const { Default, Delisted } = composeStories(stories);

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

        expect(await screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Confirm Order')).toBeInTheDocument();
        const button = screen.getByTestId('dialog-action-button');
        expect(button).toHaveTextContent('OK');
    });

    it('should display the borrow remaining and the collateral usage if its a BORROW order', async () => {
        render(<Default />);

        expect(screen.getByText('Borrow Amount')).toBeInTheDocument();
        expect(screen.getByText('100 USDC')).toBeInTheDocument();
        expect(screen.getByText('Borrow Remaining')).toBeInTheDocument();
        await waitFor(() => {
            expect(screen.getByText('$31,231.28')).toBeInTheDocument();
        });

        expect(screen.getByText('Bond Price')).toBeInTheDocument();
        expect(screen.getByText('~ 94.10')).toBeInTheDocument();
        expect(screen.getByText('APR')).toBeInTheDocument();
        expect(screen.getByText('~ 6.28%')).toBeInTheDocument();
    });

    it('should render collateral utilization in borrow orders', async () => {
        render(<Default />);

        expect(screen.getByText('Collateral Usage')).toBeInTheDocument();
        expect(screen.getByText('37%')).toBeInTheDocument();
        expect(screen.getByText('37%')).toHaveClass('text-progressBarStart');
        await waitFor(() => {
            expect(screen.getByText('55%')).toBeInTheDocument();
            expect(screen.getByText('55%')).toHaveClass('text-progressBarVia');
        });
    });

    it('should display the circuit breaker disclaimer', async () => {
        render(<Default />);

        await waitFor(() =>
            expect(screen.getByText('Dec 1, 2022')).toBeInTheDocument()
        );
        const button = screen.getByTestId('disclaimer-button');
        expect(button).toHaveTextContent('Circuit Breaker Disclaimer');
        await waitFor(() => fireEvent.click(button));
        const disclaimerText = await screen.findByTestId('disclaimer-text');
        expect(disclaimerText).toHaveTextContent(
            'Circuit breaker will be triggered if the order is filled at over 96.72 which is the max slippage level at 1 block.'
        );
    });

    it('should not display the borrow remaining and the collateral usage if its a LEND order', () => {
        render(<Default side={OrderSide.LEND} />);

        expect(screen.getByText('Lend Amount')).toBeInTheDocument();
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
        const onPlaceOrder = jest
            .fn()
            .mockReturnValue(Promise.resolve('0x123'));

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

    it('should update the lastActionTimestamp in the store when the transaction receipt is received', async () => {
        const onPlaceOrder = jest
            .fn()
            .mockReturnValue(Promise.resolve('0x123'));
        const { store } = render(<Default onPlaceOrder={onPlaceOrder} />, {
            preloadedState,
        });
        expect(store.getState().blockchain.lastActionTimestamp).toEqual(0);
        fireEvent.click(screen.getByTestId('dialog-action-button'));
        expect(await screen.findByText('Success!')).toBeInTheDocument();
        expect(store.getState().blockchain.lastActionTimestamp).toBeTruthy();
    });

    it('should call the onPlaceOrder function in market order mode if the orderType is MARKET', async () => {
        const onPlaceOrder = jest
            .fn()
            .mockReturnValue(Promise.resolve('0x123'));
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
                BigInt('100000000'),
                0,
                WalletSource.METAMASK
            )
        );
    });

    it('should call the onPlaceOrder function in limit order mode if the orderType is LIMIT', async () => {
        const onPlaceOrder = jest
            .fn()
            .mockReturnValue(Promise.resolve('0x123'));
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
                BigInt('100000000'),
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

    it('should display delisting disclaimer if currency is being delisted', () => {
        render(<Delisted />);
        expect(
            screen.getByText(
                'Please note that USDC will be delisted on Secured Finance.'
            )
        ).toBeInTheDocument();
    });

    it('should not display delisting disclaimer if currency is not being delisted', () => {
        render(<Default />);
        expect(
            screen.queryByText(
                'Please note that USDC will be delisted on Secured Finance.'
            )
        ).not.toBeInTheDocument();
    });
});
