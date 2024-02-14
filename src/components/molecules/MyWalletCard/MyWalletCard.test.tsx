import { composeStories } from '@storybook/react';
import { act, render, screen, waitFor } from 'src/test-utils.js';
import * as stories from './MyWalletCard.stories';

const { Default, HideBridge } = composeStories(stories);

describe('test MyWalletCard component', () => {
    it('should render MyWalletCard', async () => {
        await waitFor(() => render(<Default />));
        expect(screen.getByText('My Wallet')).toBeInTheDocument();
        expect(screen.getByText('de926d...aa4f')).toBeInTheDocument();
    });

    it('should show bridge dialog by default', async () => {
        await waitFor(() => render(<Default />));
        act(() => {
            screen.getByRole('button', { name: 'Bridge' }).click();
        });

        expect(await screen.findByRole('dialog')).toBeInTheDocument();
    });

    it('should hide bridge dialog when hideBridge is true', async () => {
        await waitFor(() => render(<HideBridge />));
        expect(
            screen.queryByRole('button', { name: 'Bridge' })
        ).not.toBeInTheDocument();
    });
});
