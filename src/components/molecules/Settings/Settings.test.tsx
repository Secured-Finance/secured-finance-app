import { composeStories } from '@storybook/react';
import { fireEvent, render, screen } from 'src/test-utils.js';
import * as stories from './Settings.stories';

const { Default } = composeStories(stories);

describe('Settings component', () => {
    it('should render settings component', async () => {
        render(<Default />);
        const walletButton = await screen.findByRole('button');
        fireEvent.click(walletButton);
        expect(await screen.findByText('Global Settings')).toBeInTheDocument();
    });

    it('should render un checked testnet button', async () => {
        render(<Default />);
        const walletButton = await screen.findByRole('button');
        fireEvent.click(walletButton);
        const button = await screen.findByRole('switch');
        expect(button).toHaveAttribute('aria-checked', 'false');

        fireEvent.click(button);
        expect(button).toHaveAttribute('aria-checked', 'true');
    });

    it('should render disabled and checked testnet button', async () => {
        render(<Default isProduction={false} />);
        const walletButton = await screen.findByRole('button');
        fireEvent.click(walletButton);
        const button = await screen.findByRole('switch');
        expect(button).toHaveClass('disabled:opacity-50');
        expect(button).toHaveAttribute('aria-checked', 'true');

        fireEvent.click(button);
        expect(button).toHaveAttribute('aria-checked', 'true');
    }, 8000);
});
