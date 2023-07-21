import { composeStories } from '@storybook/react';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { render, screen, waitFor } from 'src/test-utils.js';
import * as stories from './UnwindDialog.stories';

const { Default } = composeStories(stories);

const mockSecuredFinance = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mockSecuredFinance);

describe('UnwindDialog Component', () => {
    it('should render a UnwindDialog', async () => {
        await waitFor(() => render(<Default />));
    });

    it('should call the unwind function when the button is clicked', async () => {
        render(<Default />);
        screen.getByText('Confirm').click();
        await waitFor(() =>
            expect(mockSecuredFinance.unwindPosition).toHaveBeenCalled()
        );
    });

    it('should update the lastActionTimestamp in the store when the transaction receipt is received', async () => {
        const { store } = render(<Default />);
        expect(store.getState().blockchain.lastActionTimestamp).toEqual(0);
        screen.getByText('Confirm').click();
        expect(await screen.findByText('Success!')).toBeInTheDocument();
        expect(store.getState().blockchain.lastActionTimestamp).toBeTruthy();
    });

    it('should proceed to failure screen if unwindPosition throws an error', async () => {
        mockSecuredFinance.unwindPosition.mockRejectedValueOnce(
            new Error('error')
        );
        const spy = jest.spyOn(console, 'error').mockImplementation();
        render(<Default />);

        screen.getByText('Confirm').click();
        await waitFor(() =>
            expect(mockSecuredFinance.unwindPosition).toHaveBeenCalled()
        );
        await waitFor(() => expect(spy).toHaveBeenCalled());
        await waitFor(() => {
            expect(mockSecuredFinance.unwindPosition).toHaveBeenCalled();
            expect(screen.getByText('Failed!')).toBeInTheDocument();
        });
    });
});
