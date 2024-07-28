import { composeStories } from '@storybook/react';
import { mockUseSF } from 'src/stories/mocks/useSFMock';
import { render, screen } from 'src/test-utils.js';
import * as stories from './TableCardHeader.stories';

const { Default } = composeStories(stories);

const mockSecuredFinance = mockUseSF();
jest.mock('src/hooks/useSecuredFinance', () => () => mockSecuredFinance);

describe('TableCardHeader Component', () => {
    it('should render TableCardHeader', async () => {
        render(<Default />);
        expect(screen.getByRole('img')).toBeInTheDocument();
        expect(screen.getByRole('img')).toHaveClass('h-9 w-9');

        expect(screen.getByText('WFIL-MAR2023')).toBeInTheDocument();
        expect(screen.getByText('95.22')).toBeInTheDocument();
        expect(screen.getByText('4.01%')).toBeInTheDocument();
        expect(screen.getByText('Borrow')).toBeInTheDocument();
    });
});
