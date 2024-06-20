import { composeStories } from '@storybook/react';
import { fireEvent, render, screen, waitFor } from 'src/test-utils.js';
import * as stories from './MyWalletCard.stories';

const { Default } = composeStories(stories);

describe('test MyWalletCard component', () => {
    it('should render MyWalletCard', async () => {
        await waitFor(() => render(<Default />));
        expect(screen.getByText('My Wallet')).toBeInTheDocument();
        expect(screen.getByText('de926d...aa4f')).toBeInTheDocument();
    });

    // TODO: reinstate this after squid widget filecoin bridging issue is resolved
    it.skip('should show bridge dialog by default', async () => {
        await waitFor(() => render(<Default />));
        fireEvent.click(screen.getByRole('button', { name: 'Bridge' }));
        expect(await screen.findByRole('dialog')).toBeInTheDocument();
    }, 8000);
});
