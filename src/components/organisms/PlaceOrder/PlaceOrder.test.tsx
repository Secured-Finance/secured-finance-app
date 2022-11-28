import { composeStories } from '@storybook/testing-react';
import { preloadedAssetPrices } from 'src/stories/mocks/fixtures';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { fireEvent, render, screen, waitFor } from 'src/test-utils.js';
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
        expect(screen.getByText('Confirm Borrow')).toBeInTheDocument();

        const button = screen.getByTestId('dialog-action-button');
        expect(button).toHaveTextContent('OK');
    });

    it('should reach success screen when transaction receipt is received', async () => {
        const onClose = jest.fn();
        render(<Default onClose={onClose} />, { preloadedState });
        fireEvent.click(screen.getByText('OK'));

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
});
