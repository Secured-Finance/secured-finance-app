import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './HighlightChip.stories';

const { Default, SmallHighlightChip } = composeStories(stories);

describe('HighlightChip Component', () => {
    it('should render a large highligh chip', () => {
        render(<Default />);
        const chip = screen.getByText('NEW');
        expect(chip).toBeInTheDocument();
        expect(chip).toHaveClass('h-5 w-10');
    });

    it('should render a small highlight chip', () => {
        render(<SmallHighlightChip />);
        const chip = screen.getByText('NEW');
        expect(chip).toBeInTheDocument();
        expect(chip).toHaveClass('h-4 w-8');
    });
});
