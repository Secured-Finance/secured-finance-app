import { composeStories } from '@storybook/testing-react';
import { render, screen } from 'src/test-utils.js';
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

    it('should expand the menu when the button is clicked', () => {
        render(<Default />);
        const button = screen.getByRole('button', { name: 'Hamburger Menu' });
        button.click();
        expect(
            screen.getByRole('button', {
                name: 'Hamburger Menu',
                expanded: true,
            })
        ).toBeInTheDocument();
        expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it.skip('should open the sub menu when the More button is clicked', () => {
        render(<Default />);
        screen.getByRole('button', { expanded: false }).click();
        expect(screen.queryByText('Documentation')).not.toBeInTheDocument();
        screen.getByRole('button', { name: 'Show More' }).click();
        expect(screen.getByText('Documentation')).toBeInTheDocument();
    });
});
