import { composeStories } from '@storybook/react';
import { fireEvent, render, screen } from 'src/test-utils.js';
import * as stories from './RadioGroupSelector.stories';

const { NavTab, NavTabWithOptionsStyles, StyledButton } =
    composeStories(stories);

describe('RadioGroupSelector component', () => {
    it('should render lend and borrow buttons in NavTab variant', () => {
        render(<NavTab />);
        expect(screen.queryAllByRole('radiogroup')).toHaveLength(1);
        expect(screen.queryAllByRole('radio')).toHaveLength(2);
        expect(screen.getByText('Lend')).toBeInTheDocument();
        expect(screen.getByText('Borrow')).toBeInTheDocument();
    });

    it('should render lend button as active in NavTab variant', () => {
        render(<NavTab />);
        const lendButton = screen.getByText('Lend');
        expect(lendButton.parentNode).toHaveClass(
            'bg-gradient-to-b from-tabGradient2 to-tabGradient1'
        );

        const borrowButton = screen.getByText('Borrow');
        expect(borrowButton.parentNode).not.toHaveClass(
            'bg-gradient-to-b from-tabGradient2 to-tabGradient1'
        );
    });

    it('should call handleClick in NavTab variant', () => {
        const handleClick = jest.fn();
        render(<NavTab handleClick={handleClick} />);

        const borrowButton = screen.getByText('Borrow');
        expect(borrowButton.parentNode).not.toHaveClass(
            'bg-gradient-to-b from-tabGradient2 to-tabGradient1'
        );

        fireEvent.click(borrowButton);
        expect(handleClick).toBeCalledTimes(1);
        expect(handleClick).toHaveBeenCalledWith('Borrow');
        expect(borrowButton.parentNode).toHaveClass(
            'bg-gradient-to-b from-tabGradient2 to-tabGradient1'
        );
    });

    it('should render styled tabs in NavTab With Options Styles variant', () => {
        const handleClick = jest.fn();
        render(<NavTabWithOptionsStyles handleClick={handleClick} />);
        const lendButton = screen.getByText('Lend');
        expect(lendButton.parentNode).toHaveClass(
            'bg-gradient-to-b from-tabGradient4 to-tabGradient3'
        );

        const borrowButton = screen.getByText('Borrow');
        expect(borrowButton.parentNode).not.toHaveClass(
            'bg-gradient-to-b from-tabGradient6 to-tabGradient5'
        );

        fireEvent.click(borrowButton);
        expect(handleClick).toBeCalledTimes(1);
        expect(handleClick).toHaveBeenCalledWith('Borrow');
        expect(borrowButton.parentNode).toHaveClass(
            'bg-gradient-to-b from-tabGradient6 to-tabGradient5'
        );
    });

    it('should render limit, market and stop buttons in StyledButton variant', () => {
        render(<StyledButton />);
        expect(screen.queryAllByRole('radiogroup')).toHaveLength(1);
        expect(screen.queryAllByRole('radio')).toHaveLength(3);
        expect(screen.getByText('Limit')).toBeInTheDocument();
        expect(screen.getByText('Market')).toBeInTheDocument();
        expect(screen.getByText('Stop')).toBeInTheDocument();
    });

    it('should render market button as active in StyledButton variant', () => {
        render(<StyledButton />);
        const marketButton = screen.getByText('Market');
        expect(marketButton).toHaveClass('bg-starBlue text-neutral-50');

        const limitButton = screen.getByText('Limit');
        expect(limitButton).toHaveClass('text-neutral-400 opacity-70');

        const stopButton = screen.getByText('Stop');
        expect(stopButton).toHaveClass('text-neutral-400 opacity-70');
    });

    it('should call handleClick in StyledButton variant', () => {
        const handleClick = jest.fn();
        render(<StyledButton handleClick={handleClick} />);

        const stopButton = screen.getByText('Stop');
        expect(stopButton).toHaveClass('text-neutral-400 opacity-70');

        fireEvent.click(stopButton);
        expect(handleClick).toBeCalledTimes(1);
        expect(handleClick).toHaveBeenCalledWith('Stop');
        expect(stopButton).toHaveClass('bg-starBlue text-neutral-50');
    });
});
