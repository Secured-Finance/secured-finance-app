import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './Chip.stories';
import { ChipColors, ChipSizes } from './types';

const { Default } = composeStories(stories);

describe('Chip Component', () => {
    it('should render the default chip with gray color and medium size', () => {
        render(<Default />);
        const chip = screen.getByText('Borrow');
        expect(chip).toHaveClass('text-neutral-50 bg-neutral-50/10');
    });

    it('should render the chip with custom color and size', () => {
        render(
            <Default color={ChipColors.Red} size={ChipSizes.lg} label='Test' />
        );
        const chip = screen.getByText('Test');
        expect(chip).toHaveClass(
            'text-error-300 bg-error-300/10 border-error-300 px-2 text-xs leading-4 rounded-md'
        );
    });

    it('should render the custom label', () => {
        render(<Default label='Custom Label' />);
        expect(screen.getByText('Custom Label')).toBeInTheDocument();
    });
});
