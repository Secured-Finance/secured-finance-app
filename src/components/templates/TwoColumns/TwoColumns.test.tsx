import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './TwoColumns.stories';

const { Default } = composeStories(stories);

describe('TwoColumns Component', () => {
    it('should render a TwoColumns', () => {
        render(<Default />);
    });

    it('should display two columns', () => {
        render(<Default />);
        expect(screen.getByText('Column 1')).toBeInTheDocument();
        expect(screen.getByText('Column 2')).toBeInTheDocument();
    });

    it('should display the two columns with the first one being the bigger one', () => {
        render(<Default />);
        expect(screen.getByText('Column 1').parentElement).toHaveClass(
            'w-full laptop:w-70%-gap-3',
        );
        expect(screen.getByText('Column 2').parentElement).toHaveClass(
            'w-full laptop:w-30%-gap-3',
        );
    });

    it('should display the two columns with the first one being the smaller one when narrowFirstColumn is true', () => {
        render(<Default narrowFirstColumn />);
        expect(screen.getByText('Column 1').parentElement).toHaveClass(
            'w-full laptop:w-30%-gap-3',
        );
        expect(screen.getByText('Column 2').parentElement).toHaveClass(
            'w-full laptop:w-70%-gap-3',
        );
    });
});
