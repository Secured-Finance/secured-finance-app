import { composeStories } from '@storybook/testing-react';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { render, screen, waitFor } from 'src/test-utils.js';
import * as stories from './UnwindDialog.stories';

const { Default } = composeStories(stories);

const mockSecuredFinance = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mockSecuredFinance);

describe('UnwindDialog Component', () => {
    it('should render a UnwindDialog', () => {
        render(<Default />);
    });

    it('should call the unwind function when the button is clicked', async () => {
        render(<Default />);
        screen.getByText('Confirm').click();
        await waitFor(() =>
            expect(mockSecuredFinance.unwindPosition).toHaveBeenCalled()
        );
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
