import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './CurrencyIcon.stories';

const { CurrencyDefault } = composeStories(stories);

describe('CurrencyIcon Component', () => {
    it('should render a CurrencyIcon', () => {
        render(<CurrencyDefault />);
        expect(screen.getByRole('img')).toBeInTheDocument();
    });

    it('should render a CurrencyIcon with a large variant', () => {
        render(<CurrencyDefault variant='large' />);
        expect(screen.getByRole('img')).toHaveClass('h-9 w-9');
    });

    it('should render a CurrencyIcon with a default variant', () => {
        render(<CurrencyDefault variant='default' />);
        expect(screen.getByRole('img')).toHaveClass('h-6 w-6');
    });

    it('should render a CurrencyIcon with a small variant', () => {
        render(<CurrencyDefault variant='small' />);
        expect(screen.getByRole('img')).toHaveClass('h-5 w-5');
    });
});
