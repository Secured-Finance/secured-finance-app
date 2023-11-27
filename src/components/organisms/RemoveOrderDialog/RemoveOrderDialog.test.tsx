import { composeStories } from '@storybook/react';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { render, screen, waitFor } from 'src/test-utils.js';
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
        screen.getByText('OK').click();
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

        screen.getByText('OK').click();
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
        screen.getByText('OK').click();
        expect(await screen.findByText('Removed!')).toBeInTheDocument();
        expect(store.getState().blockchain.lastActionTimestamp).toBeTruthy();
    });

    it('should show cancel button', async () => {
        render(<Default />);
        expect(
            screen.getByRole('button', { name: 'Cancel' })
        ).toBeInTheDocument();
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
});
