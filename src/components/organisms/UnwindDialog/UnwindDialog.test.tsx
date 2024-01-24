import * as analytics from '@amplitude/analytics-browser';
import { composeStories } from '@storybook/react';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { render, screen, waitFor } from 'src/test-utils.js';
import { ButtonEvents, ButtonProperties } from 'src/utils';
import * as stories from './UnwindDialog.stories';

const { Default, Redeem, Repay } = composeStories(stories);

const mockSecuredFinance = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mockSecuredFinance);

describe('UnwindDialog Component', () => {
    it('should render a UnwindDialog', async () => {
        await waitFor(() => render(<Default />));
    });

    it('should open unwind dialog as default', async () => {
        await waitFor(() => render(<Default />));
        expect(screen.getByText('Unwind Position')).toBeInTheDocument();
    });

    it('should call the unwind function when the button is clicked', async () => {
        render(<Default />);
        screen.getByText('OK').click();
        await waitFor(() =>
            expect(mockSecuredFinance.unwindPosition).toHaveBeenCalled()
        );
    });

    it('should update the lastActionTimestamp in the store when the transaction receipt is received', async () => {
        const { store } = render(<Default />);
        expect(store.getState().blockchain.lastActionTimestamp).toEqual(0);
        screen.getByText('OK').click();
        expect(await screen.findByText('Success!')).toBeInTheDocument();
        expect(store.getState().blockchain.lastActionTimestamp).toBeTruthy();
    });

    it('should proceed to failure screen if unwindPosition throws an error', async () => {
        mockSecuredFinance.unwindPosition.mockRejectedValueOnce(
            new Error('error')
        );
        const spy = jest.spyOn(console, 'error').mockImplementation();
        render(<Default />);

        screen.getByText('OK').click();
        await waitFor(() =>
            expect(mockSecuredFinance.unwindPosition).toHaveBeenCalled()
        );
        await waitFor(() => expect(spy).toHaveBeenCalled());
        await waitFor(() => {
            expect(mockSecuredFinance.unwindPosition).toHaveBeenCalled();
            expect(screen.getByText('Failed!')).toBeInTheDocument();
        });
    });

    it('should open repay dialog when type is REPAY', async () => {
        await waitFor(() => render(<Repay />));
        expect(screen.getByText('Repay Position')).toBeInTheDocument();
        screen.getByText('OK').click();
        await waitFor(() =>
            expect(mockSecuredFinance.executeRepayment).toHaveBeenCalled()
        );
    });

    it('should open redeem dialog when type is REDEEM', async () => {
        await waitFor(() => render(<Redeem />));
        expect(screen.getByText('Redeem Position')).toBeInTheDocument();
        screen.getByText('OK').click();
        await waitFor(() =>
            expect(mockSecuredFinance.executeRedemption).toHaveBeenCalled()
        );
    });

    it('should call onClose when cancel button is clicked', () => {
        const track = jest.spyOn(analytics, 'track');
        const onClose = jest.fn();
        render(<Default onClose={onClose} />);
        const cancelButton = screen.getByRole('button', {
            name: 'Cancel',
        });
        cancelButton.click();
        expect(track).toHaveBeenCalledWith(ButtonEvents.CANCEL_BUTTON, {
            [ButtonProperties.CANCEL_ACTION]: 'Cancel Unwind Order',
        });
        expect(onClose).toHaveBeenCalled();
    });

    it('should not show cancel button if dialog is not on first step', async () => {
        render(<Default />);
        const cancelButton = await screen.findByRole('button', {
            name: 'Cancel',
        });
        expect(cancelButton).toBeInTheDocument();
        waitFor(() => {
            screen.getByText('OK').click();
        });
        expect(cancelButton).not.toBeInTheDocument();
    });
});
