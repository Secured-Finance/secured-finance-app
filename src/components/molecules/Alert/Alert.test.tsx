import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './Alert.stories';

const { Info, Error } = composeStories(stories);

describe('Alert Component', () => {
    it('should render an Alert', () => {
        render(<Info />);
    });

    it('should render info variant if variant is not provided', () => {
        render(<Info />);
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
        render(<Info localStorageKey='key' localStorageValue='val' />);
        expect(screen.queryByRole('alert')).toBeInTheDocument();
    });

    it('should not render alert component if localStorageValue is found in localStorage', () => {
        localStorage.setItem('key', 'val');
        render(<Info localStorageKey='key' localStorageValue='val' />);
        expect(screen.queryByRole('alert')).not.toBeInTheDocument();
    });
});
