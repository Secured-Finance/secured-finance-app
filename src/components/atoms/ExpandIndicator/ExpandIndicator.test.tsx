import { composeStories } from '@storybook/testing-react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './ExpandIndicator.stories';

const { Expanded, Collapsed } = composeStories(stories);

describe('Default ExpandIndicator Component', () => {
    it('should render an arrow pointing up to expand', () => {
        render(<Collapsed />);
        expect(screen.getByTestId('chevron-down-icon')).toBeInTheDocument();
    });

    it('should render a an arrow pointing down to collapse', () => {
        render(<Expanded />);
        expect(screen.getByTestId('chevron-up-icon')).toBeInTheDocument();
    });
});

describe('Opaque ExpandIndicator Component', () => {
    it('should render an arrow pointing up to expand', () => {
        render(<Collapsed variant='opaque' />);
        const chevron = screen.getByTestId('chevron-down-icon');
        expect(chevron).toBeInTheDocument();
        expect(chevron).toHaveClass('opacity-50');
    });

    it('should render a an arrow pointing down to collapse', () => {
        render(<Expanded variant='opaque' />);
        const chevron = screen.getByTestId('chevron-up-icon');
        expect(chevron).toBeInTheDocument();
        expect(chevron).toHaveClass('opacity-50');
    });
});
