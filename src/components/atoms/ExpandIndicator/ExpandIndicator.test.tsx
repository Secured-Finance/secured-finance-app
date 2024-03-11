import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './ExpandIndicator.stories';

const { Expanded, Collapsed } = composeStories(stories);

describe('Default ExpandIndicator Component', () => {
    it('should render an arrow pointing up to expand', () => {
        render(<Collapsed />);
        expect(screen.getByTestId('chevron-down-icon')).toBeInTheDocument();
    });

    it('should render an arrow pointing down to collapse', () => {
        render(<Expanded />);
        const chevron = screen.getByTestId('chevron-down-icon');
        expect(chevron).toBeInTheDocument();
        expect(chevron).toHaveClass('rotate-180');
    });
});

describe('Opaque ExpandIndicator Component', () => {
    it('should render an arrow pointing up to expand', () => {
        render(<Collapsed variant='opaque' />);
        const chevron = screen.getByTestId('chevron-down-icon');
        expect(chevron).toBeInTheDocument();
        expect(chevron).toHaveClass('text-neutral-400');
        expect(chevron).not.toHaveClass('rotate-180');
    });

    it('should render an arrow pointing down to collapse', () => {
        render(<Expanded variant='opaque' />);
        const chevron = screen.getByTestId('chevron-down-icon');
        expect(chevron).toBeInTheDocument();
        expect(chevron).toHaveClass('text-neutral-400 rotate-180');
    });
});
