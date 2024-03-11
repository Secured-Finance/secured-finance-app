import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './Chip.stories';
import { ChipColors, ChipSizes } from './types';

const { Default } = composeStories(stories);

describe('Chip Component', () => {
    it('should render the default chip with gray color and medium size', () => {
        render(<Default />);
        const chip = screen.getByText('Borrow');
        expect(chip).toHaveClass('text-neutral-900 bg-neutral-100');
        expect(chip).toHaveClass(
            'h-[1.0625rem] px-1.5 text-[0.625rem] rounded-[1.25rem]'
        );
    });

    it('should render the chip with custom color and size', () => {
        render(
            <Default color={ChipColors.Red} size={ChipSizes.lg} label='Test' />
        );
        const chip = screen.getByText('Test');
        expect(chip).toHaveClass('text-error-500 bg-error-50');
        expect(chip).toHaveClass('h-5 px-2 text-xs rounded-3xl');
    });

    it('should render the custom label', () => {
        render(<Default label='Custom Label' />);
        expect(screen.getByText('Custom Label')).toBeInTheDocument();
    });
});
