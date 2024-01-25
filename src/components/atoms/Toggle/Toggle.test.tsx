import { composeStories } from '@storybook/react';
import { fireEvent, render, screen } from 'src/test-utils.js';
import * as stories from './Toggle.stories';

const { Default } = composeStories(stories);

describe('Toggle component', () => {
    it('should render a toggle', () => {
        render(<Default />);
        expect(screen.getByRole('switch')).toBeInTheDocument();
    });

    it('should have a default state of true', () => {
        render(<Default />);
        expect(screen.getByRole('switch')).toHaveAttribute(
            'aria-checked',
            'true'
        );
    });

    it('should change state when clicked', () => {
        render(<Default />);
        const button = screen.getByRole('switch');
        fireEvent.click(button);
        expect(button).toHaveAttribute('aria-checked', 'false');
        fireEvent.click(button);
        expect(button).toHaveAttribute('aria-checked', 'true');
    });

    it('should be always true when toggle is disabled and is checked', () => {
        render(<Default disabled={true} checked={true} />);
        const button = screen.getByRole('switch');
        expect(button).toHaveClass('disabled:opacity-50');
        expect(button).toHaveAttribute('aria-checked', 'true');
        fireEvent.click(button);
        expect(button).toHaveAttribute('aria-checked', 'true');
    });

    it('should be always false when toggle is disabled and is un checked', () => {
        render(<Default disabled={true} checked={false} />);
        const button = screen.getByRole('switch');
        expect(button).toHaveClass('disabled:opacity-50');
        expect(button).toHaveAttribute('aria-checked', 'false');
        fireEvent.click(button);
        expect(button).toHaveAttribute('aria-checked', 'false');
    });
});
