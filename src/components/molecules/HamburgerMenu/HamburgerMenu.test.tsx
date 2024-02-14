import { composeStories } from '@storybook/react';
import { act, render, screen, waitFor } from 'src/test-utils.js';
import * as stories from './HamburgerMenu.stories';

const { Default } = composeStories(stories);

describe('HamburgerMenu Component', () => {
    it('should render the hamburger menu button a nothing else', () => {
        render(<Default />);
        expect(
            screen.getByRole('button', {
                name: 'Hamburger Menu',
            })
        ).toBeInTheDocument();
        expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    });

    it('should expand the menu when the button is clicked', async () => {
        render(<Default />);
        const button = screen.getByRole('button', { name: 'Hamburger Menu' });
        act(() => button.click());
        await waitFor(() => {
            expect(
                screen.getByRole('button', {
                    name: 'Hamburger Menu',
                    expanded: true,
                })
            ).toBeInTheDocument();
            expect(screen.getByRole('menu')).toBeInTheDocument();
        });
    });

    it('should open the sub menu when the More button is clicked', async () => {
        render(<Default />);
        act(() => screen.getByRole('button', { expanded: false }).click());
        expect(screen.queryByText('Documentation')).not.toBeInTheDocument();
        act(() => screen.getByRole('button', { name: 'Show More' }).click());
        await waitFor(() => {
            expect(screen.getByText('Documentation')).toBeInTheDocument();
        });
    });
});
