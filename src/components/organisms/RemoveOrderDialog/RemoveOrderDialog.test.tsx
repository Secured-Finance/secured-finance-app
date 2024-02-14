import * as analytics from '@amplitude/analytics-browser';
import { composeStories } from '@storybook/react';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { act, fireEvent, render, screen, waitFor } from 'src/test-utils.js';
import { ButtonEvents, ButtonProperties } from 'src/utils';
import * as stories from './RemoveOrderDialog.stories';

const { Default } = composeStories(stories);

const mockSecuredFinance = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mockSecuredFinance);

describe('RemoveOrderDialog Component', () => {
    it('should render a RemoveOrderDialog', async () => {
        await waitFor(() => render(<Default />));
    });

    it('should call the cancelLendingOrder function when the button is clicked', async () => {
        render(<Default />);
        act(() => screen.getByText('OK').click());
        await waitFor(() =>
            expect(mockSecuredFinance.cancelLendingOrder).toHaveBeenCalled()
        );
    });

    it('should proceed to failure screen if cancelLendingOrder throws an error', async () => {
        mockSecuredFinance.cancelLendingOrder.mockRejectedValueOnce(
            new Error('error')
        );
        const spy = jest.spyOn(console, 'error').mockImplementation();
        render(<Default />);

        act(() => screen.getByText('OK').click());
        await waitFor(() =>
            expect(mockSecuredFinance.cancelLendingOrder).toHaveBeenCalled()
        );
        await waitFor(() => expect(spy).toHaveBeenCalled());
        await waitFor(() => {
            expect(mockSecuredFinance.cancelLendingOrder).toHaveBeenCalled();
            expect(screen.getByText('Failed!')).toBeInTheDocument();
        });
    });

    it('should update the lastActionTimestamp in the store when the transaction receipt is received', async () => {
        const { store } = render(<Default />);
        expect(store.getState().blockchain.lastActionTimestamp).toEqual(0);
        act(() => screen.getByText('OK').click());
        expect(await screen.findByText('Removed!')).toBeInTheDocument();
        expect(store.getState().blockchain.lastActionTimestamp).toBeTruthy();
    });

    it('should not show collateral usage, transaction fee and circuit breaker disclaimer', async () => {
        render(<Default />);
        expect(screen.queryByText('Collateral Usage')).not.toBeInTheDocument();
        expect(screen.queryByText('Borrow Remaining')).not.toBeInTheDocument();
        expect(screen.queryByText('Transaction Fee %')).not.toBeInTheDocument();
        expect(
            screen.queryByText('Circuit Breaker Disclaimer')
        ).not.toBeInTheDocument();
    });

    it('should show correct price conversion and amount in USD', async () => {
        render(<Default />);
        expect(screen.getByText('WFIL')).toBeInTheDocument();
        expect(screen.getByText('100')).toBeInTheDocument();
        expect(await screen.findByText('~ $600')).toBeInTheDocument();
    });

    it('should call onClose when cancel button is clicked and emit CANCEL_BUTTON event', () => {
        const track = jest.spyOn(analytics, 'track');
        const onClose = jest.fn();
        render(<Default onClose={onClose} />);
        const cancelButton = screen.getByRole('button', {
            name: 'Cancel',
        });
        act(() => fireEvent.click(cancelButton));
        expect(onClose).toHaveBeenCalled();
        expect(track).toHaveBeenCalledWith(ButtonEvents.CANCEL_BUTTON, {
            [ButtonProperties.CANCEL_ACTION]: 'Cancel Remove Order',
        });
    });

    it('should not show cancel button if dialog is not on first step', async () => {
        render(<Default />);
        const cancelButton = await screen.findByRole('button', {
            name: 'Cancel',
        });
        expect(cancelButton).toBeInTheDocument();
        act(() => fireEvent.click(screen.getByTestId('dialog-action-button')));
        await waitFor(() => expect(cancelButton).not.toBeInTheDocument());
    });
});
