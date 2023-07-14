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
