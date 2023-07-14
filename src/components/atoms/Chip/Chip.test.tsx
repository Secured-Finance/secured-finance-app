import { composeStories } from '@storybook/react';
import { render } from 'src/test-utils.js';
import * as stories from './Chip.stories';

const { Default } = composeStories(stories);

describe('Chip Component', () => {
    it('should render a Chip', () => {
        render(<Default />);
    });

    it('should render a Chip with label "Borrow" in a red color', () => {
        render(<Default label='Borrow' />);
    });

    it('should renders label in the chip', () => {
        const screen = render(<Default label='Borrow' />);
        expect(screen.getByText(/Borrow/i)).toBeInTheDocument();
    });

    it('should render galacticOrange border when label is Borrow', () => {
        const { container } = render(<Default label='Borrow' />);
        expect(container.firstChild).toHaveClass('border-galacticOrange');
    });

    it('should render nebulaTeal border when label is Lend', () => {
        const { container } = render(<Default label='Lend' />);
        expect(container.firstChild).toHaveClass('border-nebulaTeal');
    });

    it('should render galacticOrange text when label is Borrow', () => {
        const screen = render(<Default label='Borrow' />);
        expect(screen.getByText('Borrow')).toHaveClass('text-galacticOrange');
    });

    it('should render nebulaTeal text when label is Lend', () => {
        const screen = render(<Default label='Lend' />);
        expect(screen.getByText('Lend')).toHaveClass('text-nebulaTeal');
    });
});
