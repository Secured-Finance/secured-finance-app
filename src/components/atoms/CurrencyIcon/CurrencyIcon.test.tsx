import { composeStories } from '@storybook/react';
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

    it('should render a CurrencyIcon with a xs variant', () => {
        render(<Default variant='xs' />);
        expect(screen.getByRole('img')).toHaveClass('h-4 w-4');
    });

    it('should render a CurrencyIcon with a campaign variant', () => {
        render(<Default variant='campaign' />);
        expect(screen.getByRole('img')).toHaveClass('h-[18px] w-[18px]');
    });
});
