import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './HighlightChip.stories';

const { Default, SmallHighlightChip } = composeStories(stories);

describe('HighlightChip Component', () => {
    it('should render a large highlight chip', () => {
        render(<Default />);
        const chip = screen.getByText('NEW');
        expect(chip).toBeInTheDocument();
        expect(chip).toHaveClass(
            'h-5 w-10 typography-dropdown-selection-label text-white',
        );
    });

    it('should render a small highlight chip', () => {
        render(<SmallHighlightChip />);
        const chip = screen.getByText('NEW');
        expect(chip).toBeInTheDocument();
        expect(chip).toHaveClass('typography-caption-3 h-4 w-8 text-neutral-8');
    });
});
