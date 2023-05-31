import { composeStories } from '@storybook/testing-react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './TwoColumnsWithTopBar.stories';

const { Default } = composeStories(stories);

describe('TwoColumnsWithTopBar Component', () => {
    it('should render a TwoColumnsWithTopBar', () => {
        render(<Default />);
    });

    it('should display two columns and the title', () => {
        render(<Default />);
        expect(screen.getByText('Column 1')).toBeInTheDocument();
        expect(screen.getByText('Column 2')).toBeInTheDocument();
        expect(screen.getByText('This is a great top bar')).toBeInTheDocument();
    });

    it('should display the two columns with the first one being the smaller one', () => {
        render(<Default />);
        expect(screen.getByText('Column 1').parentElement).toHaveClass(
            ' w-full laptop:w-[30%]'
        );
        expect(screen.getByText('Column 2').parentElement).toHaveClass(
            ' w-full laptop:w-[70%]'
        );
    });
});
