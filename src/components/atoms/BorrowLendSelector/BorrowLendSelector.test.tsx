import { composeStories } from '@storybook/testing-react';
import { fireEvent, render, screen } from 'src/test-utils.js';
import * as stories from './BorrowLendSelector.stories';

const { Default } = composeStories(stories);

describe('BorrowLendSelector component', () => {
    it('should render borrow/lend button', () => {
        render(<Default />);
        expect(screen.queryAllByRole('radiogroup')).toHaveLength(1);
        expect(screen.queryAllByRole('radio')).toHaveLength(2);
        expect(screen.getByText('Borrow')).toBeInTheDocument();
        expect(screen.getByText('Lend')).toBeInTheDocument();
    });

    it('should render borrow button as active', () => {
        render(<Default />);
        const borrowButton = screen.getByText('Borrow');
        expect(borrowButton).toHaveClass('bg-starBlue text-neutral-8');
        const lendButton = screen.getByText('Lend');
        expect(lendButton).toHaveClass('text-neutral-8 opacity-70');
    });

    it('should call onclick', () => {
        const onClick = jest.fn();
        render(<Default handleClick={onClick} />);

        const lendButton = screen.getByText('Lend');
        fireEvent.click(lendButton);
        expect(onClick).toBeCalledTimes(1);
        expect(onClick).toHaveBeenCalledWith('0');
    });
});
