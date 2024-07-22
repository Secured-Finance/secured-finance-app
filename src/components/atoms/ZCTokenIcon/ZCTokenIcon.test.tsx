import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './ZCTokenIcon.stories';

const { Default } = composeStories(stories);

describe('CurrencyIcon Component', () => {
    it('should render a CurrencyIcon', () => {
        render(<Default />);
        expect(screen.getByRole('img')).toBeInTheDocument();
    });

    it('should render a CurrencyIcon with a large variant', () => {
        render(<Default variant='large' />);
        expect(screen.getByRole('img')).toHaveClass('h-9 w-9');
    });

    it('should render a CurrencyIcon with a default variant', () => {
        render(<Default variant='default' />);
        expect(screen.getByRole('img')).toHaveClass('h-6 w-6');
    });

    it('should render a CurrencyIcon with a small variant', () => {
        render(<Default variant='small' />);
        expect(screen.getByRole('img')).toHaveClass('h-5 w-5');
    });
});
