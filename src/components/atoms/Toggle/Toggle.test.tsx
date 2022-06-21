import { composeStories } from '@storybook/testing-react';
import { fireEvent, render, screen } from 'src/test-utils.js';
import * as stories from './Toggle.stories';

const { Default } = composeStories(stories);

describe('Toggle component', () => {
    it('should render a toggle', () => {
        render(<Default />);
        expect(screen.getByRole('switch')).toBeInTheDocument();
    });

    it('should change state when clicked', () => {
        render(<Default />);
        const button = screen.getByRole('switch');
        fireEvent.click(button);
        expect(button).toHaveAttribute('aria-checked', 'true');
        fireEvent.click(button);
        expect(button).toHaveAttribute('aria-checked', 'false');
    });
});
