import { composeStories } from '@storybook/react';
import { fireEvent, render, screen } from 'src/test-utils.js';
import { testnetsEnabledId } from './Settings';
import * as stories from './Settings.stories';

const { Default } = composeStories(stories);

describe('Settings component', () => {
    it('should render settings component', async () => {
        render(<Default />);
        const walletButton = await screen.findByRole('button');
        fireEvent.click(walletButton);
        expect(await screen.findByText('Global Settings')).toBeInTheDocument();
    });

    it('should render enabled testnet button', async () => {
        localStorage.setItem(testnetsEnabledId, 'true');
        render(<Default />);
        const walletButton = await screen.findByRole('button');
        fireEvent.click(walletButton);
        const button = await screen.findByRole('switch');
        expect(button).toHaveAttribute('aria-checked', 'true');

        fireEvent.click(button);
        expect(button).toHaveAttribute('aria-checked', 'false');
    });
});
