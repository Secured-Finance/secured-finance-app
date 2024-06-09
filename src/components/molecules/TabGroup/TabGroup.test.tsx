import { composeStories } from '@storybook/react';
import { fireEvent, render, screen } from 'src/test-utils.js';
import * as stories from './TabGroup.stories';

const { Default } = composeStories(stories);

describe('TabGroup component', () => {
    it('should render Lend and Borrow buttons', () => {
        render(<Default />);
        expect(screen.queryAllByRole('radiogroup')).toHaveLength(1);
        expect(screen.queryAllByRole('radio')).toHaveLength(2);
        expect(screen.getByText('Lend')).toBeInTheDocument();
        expect(screen.getByText('Borrow')).toBeInTheDocument();
    });

    it('should render lend button as active', () => {
        render(<Default />);
        const lendButton = screen.getByText('Lend');
        expect(lendButton.parentNode?.parentNode).toHaveClass(
            'from-tabGradient-lend-start to-tabGradient-lend-end'
        );

        const borrowButton = screen.getByText('Borrow');
        expect(borrowButton.parentNode?.parentNode).not.toHaveClass(
            'from-tabGradient-borrow-start to-tabGradient-borrow-end'
        );
    });

    it('should call handleClick in NavTab variant', () => {
        const handleClick = jest.fn();
        render(<Default handleClick={handleClick} />);

        const borrowButton = screen.getByText('Borrow');
        expect(borrowButton.parentNode?.parentNode).not.toHaveClass(
            'from-tabGradient-borrow-start to-tabGradient-borrow-end'
        );

        fireEvent.click(borrowButton);
        expect(handleClick).toBeCalledTimes(1);
        expect(handleClick).toHaveBeenCalledWith('Borrow');
        expect(borrowButton.parentNode?.parentNode).toHaveClass(
            'from-tabGradient-borrow-start to-tabGradient-borrow-end'
        );
    });
});
