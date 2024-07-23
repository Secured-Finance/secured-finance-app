import { composeStories } from '@storybook/react';
import { fireEvent, render, screen, waitFor } from 'src/test-utils.js';
import * as stories from './Snackbar.stories';

const { Default, Blue } = composeStories(stories);

describe('Snackbar Component', () => {
    it('should render a Snackbar with title and description', async () => {
        render(<Default />);

        const btn = screen.getByRole('button', { name: 'Show Snackbar' });
        fireEvent.click(btn);

        await waitFor(() => {
            expect(screen.getByText('Alert title')).toBeInTheDocument();
            expect(
                screen.getByText(
                    'Interactively monetize corporate alignments and fully tested niche markets.'
                )
            ).toBeInTheDocument();
        });
    });

    it('should render a Snackbar with styles corresponding to its variant', async () => {
        render(<Blue />);

        const btn = screen.getByRole('button', { name: 'Show Snackbar' });
        fireEvent.click(btn);

        await waitFor(() => {
            expect(screen.getByTestId('snackbar-icon')).toHaveClass(
                'text-primary-300'
            );
        });
    });

    it('should close the Snackbar if the close button is clicked', async () => {
        render(<Default />);

        const btn = screen.getByRole('button', { name: 'Show Snackbar' });
        fireEvent.click(btn);

        await waitFor(() => {
            expect(
                screen.getByTestId('snackbar-close-btn')
            ).toBeInTheDocument();
        });

        fireEvent.click(screen.getByTestId('snackbar-close-btn'));
        expect(screen.queryByText('Alert title')).not.toBeInTheDocument();
    });
});
