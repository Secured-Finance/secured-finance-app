import { composeStories } from '@storybook/testing-react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './HorizontalListItem.stories';

const { Default, WithChildren } = composeStories(stories);

describe('HorizontalListItem Component', () => {
    it('should render a HorizontalListItem', () => {
        render(<Default />);
    });

    it('should contain a label and a value', () => {
        render(<Default />);
        expect(screen.getByText('Label')).toBeInTheDocument();
        expect(screen.getByText('Label')).toHaveClass('text-planetaryPurple');
        expect(screen.getByText('Value')).toBeInTheDocument();
        expect(screen.getByText('Value')).toHaveClass('text-neutral-8');
    });

    it('should contain label and value as children', () => {
        render(<WithChildren />);
        expect(screen.getByText('Label')).toBeInTheDocument();
        expect(screen.getByText('Label')).toHaveClass('text-white');
        expect(screen.getByText('Value')).toBeInTheDocument();
        expect(screen.getByText('Value')).toHaveClass('text-green');
    });
});
