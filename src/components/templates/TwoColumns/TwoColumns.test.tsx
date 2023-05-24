import { composeStories } from '@storybook/testing-react';
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
            'tablet:w-[70%]'
        );
        expect(screen.getByText('Column 2').parentElement).toHaveClass(
            'tablet:w-[30%]'
        );
    });

    it('should display the two columns with the first one being the smaller one when narrowFirstColumn is true', () => {
        render(<Default narrowFirstColumn />);
        expect(screen.getByText('Column 1').parentElement).toHaveClass(
            'tablet:w-[30%]'
        );
        expect(screen.getByText('Column 2').parentElement).toHaveClass(
            'tablet:w-[70%]'
        );
    });
});
