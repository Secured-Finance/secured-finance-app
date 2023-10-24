import { composeStories } from '@storybook/react';
import { render, screen, waitFor } from 'src/test-utils.js';
import * as stories from './MyWalletCard.stories';

const { Default } = composeStories(stories);

describe('test MyWalletCard component', () => {
    it('should render MyWalletCard', async () => {
        await waitFor(() => render(<Default />));
        expect(screen.getByText('My Wallet')).toBeInTheDocument();
        expect(screen.getByText('de926d...aa4f')).toBeInTheDocument();
        expect(screen.getAllByRole('button')).toHaveLength(1);
    });
});
