import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './ThreeColumnsWithTopBar.stories';

const { Default } = composeStories(stories);

describe('ThreeColumnsWithTopBar', () => {
    it('renders without crashing', () => {
        render(<Default />);
    });

    it('renders the topBar prop correctly', () => {
        render(<Default />);
        expect(screen.getByText('Top Bar')).toBeInTheDocument();
    });

    it('renders the children props in the correct columns', () => {
        render(<Default />);
        expect(screen.getByText('Column 1').parentElement).toHaveClass(
            'order-2',
        );
        expect(screen.getByText('Column 2').parentElement).toHaveClass(
            'order-4',
        );
        expect(screen.getByText('Column 3').parentElement).toHaveClass(
            'order-3',
        );
    });

    it('renders correctly when passed different types of children props', () => {
        render(
            <Default topBar={<div>Top Bar</div>}>
                <span>Child 1</span>
                <button>Child 2</button>
                <input placeholder='Child 3' />
            </Default>,
        );
        expect(screen.getByText('Child 1')).toBeInTheDocument();
        expect(screen.getByText('Child 2')).toBeInTheDocument();
        expect(screen.getByPlaceholderText('Child 3')).toBeInTheDocument();
    });
});
