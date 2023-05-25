import { composeStories } from '@storybook/testing-react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './HamburgerMenu.stories';

const { Default } = composeStories(stories);

describe('HamburgerMenu Component', () => {
    it('should render a HamburgerMenu', () => {
        render(<Default />);
    });

    it('should render the hamburger menu button', () => {
        render(<Default />);
        expect(
            screen.getByRole('button', { expanded: false })
        ).toBeInTheDocument();
    });

    it('should expand the menu when the button is clicked', () => {
        render(<Default />);
        const button = screen.getByRole('button', { expanded: false });
        button.click();
        expect(
            screen.getByRole('button', { expanded: true })
        ).toBeInTheDocument();
    });
});
