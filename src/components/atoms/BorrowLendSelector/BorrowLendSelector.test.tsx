import { composeStories } from '@storybook/react';
import { fireEvent, render, screen } from 'src/test-utils.js';
import * as stories from './BorrowLendSelector.stories';

const { Simple, Advanced } = composeStories(stories);

describe('BorrowLendSelector component', () => {
    it('should render borrow/lend button in simple variant', () => {
        render(<Simple />);
        expect(screen.queryAllByRole('radiogroup')).toHaveLength(1);
        expect(screen.queryAllByRole('radio')).toHaveLength(2);
        expect(screen.getByText('Borrow')).toBeInTheDocument();
        expect(screen.getByText('Lend')).toBeInTheDocument();
    });

    it('should render borrow/lend button in advanced variant', () => {
        render(<Advanced />);
        expect(screen.queryAllByRole('radiogroup')).toHaveLength(1);
        expect(screen.queryAllByRole('radio')).toHaveLength(2);
        expect(screen.getByText('Borrow')).toBeInTheDocument();
        expect(screen.getByText('Lend')).toBeInTheDocument();
    });

    it('should render borrow button as active in simple variant', () => {
        render(<Simple />);
        const borrowButton = screen.getByText('Borrow');
        expect(borrowButton.parentNode).toHaveClass(
            'bg-gradient-to-b from-tabGradient2 to-tabGradient1'
        );
        const lendButton = screen.getByText('Lend');
        expect(lendButton.parentNode).not.toHaveClass(
            'bg-gradient-to-b from-tabGradient2 to-tabGradient1'
        );
    });

    it('should render lend button as active in advanced variant', () => {
        render(<Advanced />);
        const lendButton = screen.getByText('Lend');
        expect(lendButton).toHaveClass('bg-starBlue text-neutral-8');
        const borrowButton = screen.getByText('Borrow');
        expect(borrowButton).toHaveClass('text-neutral-8 opacity-70');
    });

    it('should call onclick in simple variant', () => {
        const onClick = jest.fn();
        render(<Simple handleClick={onClick} />);

        const lendButton = screen.getByText('Lend');
        fireEvent.click(lendButton);
        expect(onClick).toBeCalledTimes(1);
        expect(onClick).toHaveBeenCalledWith('0');
    });

    it('should call onclick in advanced variant', () => {
        const onClick = jest.fn();
        render(<Advanced handleClick={onClick} />);

        const borrowButton = screen.getByText('Borrow');
        fireEvent.click(borrowButton);
        expect(onClick).toBeCalledTimes(1);
        expect(onClick).toHaveBeenCalledWith('1');
    });
});
