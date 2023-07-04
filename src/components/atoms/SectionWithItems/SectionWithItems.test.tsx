import { composeStories } from '@storybook/testing-react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './SectionWithItems.stories';

const { Default, WithChildren } = composeStories(stories);

describe('SectionWithItems Component', () => {
    it('should render a SectionWithItems', () => {
        render(<Default />);
    });

    it('should contain 2 rows of label and value', () => {
        render(<Default />);
        expect(screen.getByText('Label A')).toBeInTheDocument();
        expect(screen.getByText('Label A')).toHaveClass('text-planetaryPurple');
        expect(screen.getByText('Value A')).toBeInTheDocument();
        expect(screen.getByText('Value A')).toHaveClass('text-neutral-8');

        expect(screen.getByText('Label B')).toBeInTheDocument();
        expect(screen.getByText('Label B')).toHaveClass('text-planetaryPurple');
        expect(screen.getByText('Value B')).toBeInTheDocument();
        expect(screen.getByText('Value B')).toHaveClass('text-neutral-8');
    });

    it('should contain 2 rows of label and value as children', () => {
        render(<WithChildren />);
        expect(screen.getByText('Label A')).toBeInTheDocument();
        expect(screen.getByText('Label A')).toHaveClass('text-white');
        expect(screen.getByText('Value A')).toBeInTheDocument();
        expect(screen.getByText('Value A')).toHaveClass('text-green');

        expect(screen.getByText('Label B')).toBeInTheDocument();
        expect(screen.getByText('Label B')).toHaveClass('text-white');
        expect(screen.getByText('Value B')).toBeInTheDocument();
        expect(screen.getByText('Value B')).toHaveClass('text-green');
    });
});
