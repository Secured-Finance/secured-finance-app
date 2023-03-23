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
            expect(mockSecuredFinance.unwindOrder).toHaveBeenCalled()
        );
    });
});
