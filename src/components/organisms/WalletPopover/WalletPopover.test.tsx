import { fireEvent, render, screen, waitFor } from 'src/test-utils.js';

import { composeStories } from '@storybook/react';
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
                chainId: 11155111,
                chainError: true,
            },
        };
        render(<Default />, { preloadedState: preloadedState });
        fireEvent.click(screen.getByRole('button'));
        await waitFor(() => {
            expect(screen.getByText('Sepolia')).toBeInTheDocument();
        });
        const alertIcon = screen.getByTestId('network-alert-triangle');
        fireEvent.mouseEnter(alertIcon);
        const tooltip = screen.getByRole('tooltip');
        expect(tooltip).toHaveTextContent(
            'Secured Finance only supported on Sepolia in Ethereum'
        );
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
