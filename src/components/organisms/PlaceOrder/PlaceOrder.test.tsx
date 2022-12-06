import { composeStories } from '@storybook/testing-react';
import { BigNumber } from 'ethers';
import { OrderSide } from 'src/hooks';
import { preloadedAssetPrices } from 'src/stories/mocks/fixtures';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { fireEvent, render, screen, waitFor } from 'src/test-utils.js';
import { CurrencySymbol } from 'src/utils';
import * as stories from './PlaceOrder.stories';

const { Default } = composeStories(stories);

// @ts-expect-error: this is a mock for the IntersectionObserver.
global.IntersectionObserver = class FakeIntersectionObserver {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    observe() {}
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    disconnect() {}
};

const preloadedState = { ...preloadedAssetPrices };

const mockSecuredFinance = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mockSecuredFinance);

describe('PlaceOrder component', () => {
    it('should display the Place Order Modal when open', () => {
        render(<Default />);

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Confirm Order')).toBeInTheDocument();

        const button = screen.getByTestId('dialog-action-button');
        expect(button).toHaveTextContent('OK');
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

    it('should call the onPlaceOrder with the initial value when clicked on the dialog action button', async () => {
        const tx = {
            wait: jest.fn(() => Promise.resolve({ blockNumber: 13115215 })),
        } as unknown;
        const onPlaceOrder = jest.fn().mockReturnValue(Promise.resolve(tx));
        render(<Default onPlaceOrder={onPlaceOrder} />);
        fireEvent.click(screen.getByTestId('dialog-action-button'));
        await waitFor(() =>
            expect(onPlaceOrder).toHaveBeenCalledWith(
                CurrencySymbol.FIL,
                BigNumber.from(0),
                OrderSide.Borrow,
                BigNumber.from(0),
                10000
            )
        );
    });

    it.skip('should write an error in the store if onPlaceOrder throw an error', async () => {
        const onPlaceOrder = jest.fn(() => {
            throw new Error('This is an error');
        });
        const { store } = render(<Default onPlaceOrder={onPlaceOrder} />);
        fireEvent.click(screen.getByTestId('dialog-action-button'));
        await waitFor(() =>
            expect(store.getState()).toEqual('This is an error')
        );
    });
});
