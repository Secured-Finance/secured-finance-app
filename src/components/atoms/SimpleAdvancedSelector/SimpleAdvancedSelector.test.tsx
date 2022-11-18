import { composeStories } from '@storybook/testing-react';
import { fireEvent, render, screen } from 'src/test-utils.js';
import * as stories from './SimpleAdvancedSelector.stories';

const { Default } = composeStories(stories);

describe('SimpleAdvancedSelector component', () => {
    it('should render simple/advanced button', () => {
        render(<Default />);
        expect(screen.queryAllByRole('radiogroup')).toHaveLength(1);
        expect(screen.queryAllByRole('radio')).toHaveLength(2);
        expect(screen.getByText('Simple')).toBeInTheDocument();
        expect(screen.getByText('Advanced')).toBeInTheDocument();
    });

    it('should render simple button as active', () => {
        render(<Default />);
        const borrowButton = screen.getByText('Simple');
        expect(borrowButton).toHaveClass('bg-starBlue text-white');
        const lendButton = screen.getByText('Advanced');
        expect(lendButton).toHaveClass('text-white opacity-40');
    });

    it('should call onclick', () => {
        const onClick = jest.fn();
        render(<Default handleClick={onClick} />);

        const advancedButton = screen.getByText('Advanced');
        fireEvent.click(advancedButton);
        expect(onClick).toBeCalledTimes(1);
        expect(onClick).toHaveBeenCalledWith('Advanced');
    });
});
