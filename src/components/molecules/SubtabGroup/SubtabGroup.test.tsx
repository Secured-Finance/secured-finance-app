import { composeStories } from '@storybook/react';
import { fireEvent, render, screen } from 'src/test-utils.js';
import * as stories from './SubtabGroup.stories';

const { Default, GroupOfThree } = composeStories(stories);

describe('SubtabGroup component', () => {
    it('should render two buttons', () => {
        render(<Default />);
        expect(screen.queryAllByRole('radiogroup')).toHaveLength(1);
        expect(screen.queryAllByRole('radio')).toHaveLength(2);
        expect(screen.getByText('Market')).toBeInTheDocument();
        expect(screen.getByText('Limit')).toBeInTheDocument();
    });

    it('should render Limit button as active', () => {
        render(<Default />);
        const limitBtn = screen.getByText('Limit');
        expect(limitBtn).toHaveClass('bg-primary-700 text-neutral-50');

        const marketBtn = screen.getByText('Market');
        expect(marketBtn).toHaveClass('text-neutral-400');
    });

    it('should render three Subtabs', () => {
        render(<GroupOfThree />);
        expect(screen.queryAllByRole('radio')).toHaveLength(3);
    });

    it('should call handleClick', () => {
        const handleClick = jest.fn();
        render(<Default handleClick={handleClick} />);

        const marketBtn = screen.getByText('Market');
        expect(marketBtn).toHaveClass('text-neutral-400');

        fireEvent.click(marketBtn);
        expect(handleClick).toBeCalledTimes(1);
        expect(handleClick).toHaveBeenCalledWith('Market');
        expect(marketBtn).toHaveClass('bg-primary-700 text-neutral-50');
    });
});
