import { fireEvent, render, screen, waitFor } from 'src/test-utils.js';

import { composeStories } from '@storybook/testing-react';
import * as stories from './WalletDialog.stories';

const { Primary } = composeStories(stories);

const preloadedState = {
    interactions: {
        walletDialogOpen: true,
    },
    blockchain: {
        chainError: false,
    },
};

const selectMetamaskOption = () => {
    const radio = screen.getAllByRole('radio');
    fireEvent.click(radio[0]);
};

describe('Wallet Dialog component', () => {
    it('should display the wallet radio group in a modal at open', () => {
        render(<Primary />, { preloadedState });

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Select Wallet Provider')).toBeInTheDocument();

        const button = screen.getByTestId('dialog-action-button');
        expect(button).toHaveTextContent('Connect Wallet');

        expect(screen.getAllByRole('radio')).toHaveLength(1);
    });

    it('should open with nothing selected', () => {
        render(<Primary />, { preloadedState });
        screen.getAllByRole('radio').forEach(radio => {
            expect(radio).toHaveAttribute('aria-checked', 'false');
        });
    });

    it('should do nothing when no option is selected and button is clicked', () => {
        render(<Primary />, { preloadedState });

        const button = screen.getByTestId('dialog-action-button');
        fireEvent.click(button);
        expect(screen.getAllByRole('radio')).toHaveLength(1);
    });

    it('should move to the next step if an option was selected', async () => {
        render(<Primary />, { preloadedState });
        selectMetamaskOption();
        fireEvent.click(screen.getByTestId('dialog-action-button'));
        await waitFor(() => {
            expect(screen.getByText('Connecting...')).toBeInTheDocument();
        });
    });

    it.skip('should proceed to failure screen if something goes wrong', async () => {
        const useWalletMock = {
            connect: jest.fn().mockRejectedValueOnce(new Error('failed')),
        };
        render(<Primary />, { preloadedState });
        selectMetamaskOption();
        fireEvent.click(screen.getByTestId('dialog-action-button'));
        await waitFor(() => {
            expect(useWalletMock.connect).toBeCalled();
            expect(screen.getByText('Failed!')).toBeInTheDocument();
        });
    });
});
