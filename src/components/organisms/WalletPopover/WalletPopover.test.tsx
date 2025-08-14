import { composeStories } from '@storybook/react';
import userEvent from '@testing-library/user-event';
import { fireEvent, render, screen, waitFor } from 'src/test-utils.js';
import * as stories from './WalletPopover.stories';

const { Default } = composeStories(stories);

describe('WalletPopover component', () => {
    it('should render when clicked on the the wallet button', async () => {
        render(<Default />);
        expect(screen.queryByText('Sepolia')).toBeNull();
        fireEvent.click(screen.getByRole('button'));
        await waitFor(() => {
            expect(screen.getByText('Sepolia')).toBeInTheDocument();
        });
    });

    it('should render an alert if current chain is not supported', async () => {
        const preloadedState = {
            blockchain: {
                chainError: true,
            },
        };
        render(<Default />, { preloadedState: preloadedState });
        fireEvent.click(screen.getByRole('button'));
        await waitFor(() => {
            expect(screen.getByText('Sepolia')).toBeInTheDocument();
        });
        const alertIcon = screen.getByTestId('network-alert-triangle');

        await userEvent.unhover(alertIcon);
        await userEvent.hover(alertIcon);
        const tooltip = await screen.findByText(
            'Secured Finance is not supported on this network. Please switch to a supported network.'
        );
        expect(tooltip).toBeInTheDocument();
    });

    it('should have a default cursor if there is no onclick action', async () => {
        render(<Default />);
        fireEvent.click(screen.getByRole('button'));
        await waitFor(() => {
            screen
                .getAllByRole('button', {
                    name: 'Menu Item',
                })
                .forEach(button => {
                    if (!button.hasAttribute('onclick')) {
                        expect(button).toHaveStyle('cursor: default');
                    } else {
                        expect(button).toHaveStyle('cursor: pointer');
                    }
                });
        });
    });
});
