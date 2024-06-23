import { composeStories } from '@storybook/react';
import { render, screen, waitFor } from 'src/test-utils.js';
import * as stories from './MyWalletCard.stories';

const { Default, HideBridge } = composeStories(stories);

describe('test MyWalletCard component', () => {
    it('should render MyWalletCard', async () => {
        await waitFor(() => render(<Default />));
        expect(screen.getByText('My Wallet')).toBeInTheDocument();
        expect(screen.getByText('de926d...aa4f')).toBeInTheDocument();
    });

    it('should contain a link to the Bridge page', async () => {
        await waitFor(() => render(<Default />));
        const bridgeButton = screen.getByRole('button', { name: 'Bridge' });
        expect(bridgeButton.parentElement).toHaveAttribute('href', '/bridge');
    });

    it('should hide bridge dialog when hideBridge is true', async () => {
        await waitFor(() => render(<HideBridge />));
        expect(
            screen.queryByRole('button', { name: 'Bridge' })
        ).not.toBeInTheDocument();
    });
});
