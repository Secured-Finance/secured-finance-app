import { composeStories } from '@storybook/react';
import { fireEvent, render, screen, waitFor } from 'src/test-utils.js';
import * as stories from './MenuPopover.stories';

const { Default } = composeStories(stories);

describe('MenuPopover component', () => {
    it('should have a button with text More', () => {
        render(<Default />);
        const button = screen.getByRole('button', { name: 'More' });
        expect(button).toBeInTheDocument();
    });

    it.skip('should render when clicked on the More... button', async () => {
        render(<Default />);
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
        await waitFor(() => {
            fireEvent.click(screen.getByRole('button'));
        });
        expect(await screen.findByRole('menu')).toBeInTheDocument();
        expect(screen.queryAllByText('Menu Item')).toHaveLength(5);
    });
});
