import { composeStories } from '@storybook/testing-react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './CurrencyIcon.stories';

const { Default } = composeStories(stories);

describe('CurrencyIcon Component', () => {
    it('should render a CurrencyIcon', () => {
        render(<Default />);
        expect(screen.getByRole('img')).toBeInTheDocument();
    });

    it('should render a CurrencyIcon with a large variant', () => {
        render(<Default variant='large' />);
        expect(screen.getByRole('img')).toHaveClass('h-10 w-10');
    });

    it('should render a CurrencyIcon with a default variant', () => {
        render(<Default variant='default' />);
        expect(screen.getByRole('img')).toHaveClass('h-6 w-6');
    });
});
