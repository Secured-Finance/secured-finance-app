import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './Alert.stories';

const { Default, WithCloseButton } = composeStories(stories);

describe('Alert Component', () => {
    it('should render a Alert', () => {
        render(<Default />);
    });

    it('should render solid variant if variant is not provided', () => {
        render(<Default />);
        const alert = screen.getByRole('alert');
        expect(alert).toHaveClass(
            'bg-[rgba(41, 45, 63, 0.60)] border border-white-10 shadow-tab'
        );
        expect(alert).not.toHaveClass('border-2 border-yellow bg-yellow/20');
    });

    it('should render outlined variant if specified', () => {
        render(<Default variant='outlined' />);
        const alert = screen.getByRole('alert');
        expect(alert).not.toHaveClass(
            'bg-[rgba(41, 45, 63, 0.60)] border border-white-10 shadow-tab'
        );
        expect(alert).toHaveClass('border-2 border-yellow bg-yellow/20');
    });

    it('should not render a close button if showCloseButton is false', () => {
        render(<Default />);
        const closeButton = screen.queryByTestId('close-button');
        expect(closeButton).not.toBeInTheDocument();
    });

    it('should  render a close button if showCloseButton is true', () => {
        render(<WithCloseButton />);
        const closeButton = screen.getByTestId('close-button');
        expect(closeButton).toBeInTheDocument();
    });
});
