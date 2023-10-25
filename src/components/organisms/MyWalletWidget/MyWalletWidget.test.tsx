import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './MyWalletWidget.stories';

const { Default, Connected } = composeStories(stories);

describe('MyWalletWidget Component', () => {
    it('should offer the user to connect when they are not connected', () => {
        render(<Default />);
        expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
    });

    it('should show the wallet when the user is connected', async () => {
        render(<Connected />);
        expect(await screen.findByText('My Wallet')).toBeInTheDocument();
    });
});
