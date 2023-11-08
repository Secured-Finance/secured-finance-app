import { composeStories } from '@storybook/react';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { render, screen, waitFor } from 'src/test-utils.js';
import * as stories from './CancelDialog.stories';

const { Default } = composeStories(stories);

const mockSecuredFinance = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mockSecuredFinance);

describe('CancelDialog Component', () => {
    it('should render a CancelDialog', async () => {
        await waitFor(() => render(<Default />));
    });

    it('should call the cancelLendingOrder function when the button is clicked', async () => {
        render(<Default />);
        screen.getByText('Confirm').click();
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

        screen.getByText('Confirm').click();
        await waitFor(() =>
            expect(mockSecuredFinance.cancelLendingOrder).toHaveBeenCalled()
        );
        await waitFor(() => expect(spy).toHaveBeenCalled());
        await waitFor(() => {
            expect(mockSecuredFinance.cancelLendingOrder).toHaveBeenCalled();
            expect(screen.getByText('Failed!')).toBeInTheDocument();
        });
    });
});
