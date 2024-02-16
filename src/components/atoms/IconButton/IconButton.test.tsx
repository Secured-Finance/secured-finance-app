import { composeStories } from '@storybook/react';
import { fireEvent, render, screen } from 'src/test-utils.js';
import * as stories from './IconButton.stories';

const { Primary, Secondary, SecondaryBuy, SecondarySell } =
    composeStories(stories);

describe('IconButton component', () => {
    it('should render a button', () => {
        render(<Primary />);
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should call the onClick argument when clicked', () => {
        const onClick = jest.fn();
        render(<Primary onClick={onClick} />);

        fireEvent.click(screen.getByRole('button'));
        expect(onClick).toHaveBeenCalled();
    });

    it('should render a grey background when variant is secondary', async () => {
        render(<Secondary />);
        expect(screen.getByRole('button')).toHaveClass('bg-neutral-800');
    });

    it('should render a green background when variant is secondary-buy', async () => {
        render(<SecondaryBuy />);
        expect(screen.getByRole('button')).toHaveClass('bg-success-700');
    });

    it('should render a red background when variant is secondary-sell', async () => {
        render(<SecondarySell />);
        expect(screen.getByRole('button')).toHaveClass('bg-error-700');
    });
});
