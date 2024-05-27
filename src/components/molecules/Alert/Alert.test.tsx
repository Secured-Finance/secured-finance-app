import { composeStories } from '@storybook/react';
import { fireEvent, render, screen } from 'src/test-utils.js';
import * as stories from './Alert.stories';

const { Default, Error } = composeStories(stories);

describe('Alert Component', () => {
    it('should render an Alert', () => {
        render(<Default />);
    });

    it('should render info variant if variant is not provided', () => {
        render(<Default />);
        const alert = screen.getByRole('alert');
        expect(alert).toHaveClass('border-primary-300 bg-primary-500/10');
    });

    it('should render error variant if specified', () => {
        render(<Error />);
        const alert = screen.getByRole('alert');
        expect(alert).toHaveClass('border-error-300 bg-error-500/10');
    });

    it('should render alert component if localStorageValue is not found in localStorage', () => {
        localStorage.setItem('key', 'value');
        render(<Default localStorageKey='key' localStorageValue='val' />);
        expect(screen.queryByRole('alert')).toBeInTheDocument();
    });

    it('should not render alert component if localStorageValue is found in localStorage', () => {
        localStorage.setItem('key', 'val');
        render(<Default localStorageKey='key' localStorageValue='val' />);
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });

    it('should render a close button that closes the alert when clicked', () => {
        render(<Default />);
        const closeButton = screen.getByTestId('close-button');
        const alert = screen.getByRole('alert');
        expect(closeButton).toBeInTheDocument();

        fireEvent.click(closeButton);
        expect(alert).not.toBeInTheDocument();
    });
});
