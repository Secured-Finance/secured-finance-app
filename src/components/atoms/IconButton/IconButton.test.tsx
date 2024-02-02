import { composeStories } from '@storybook/react';
import { fireEvent, render, screen } from 'src/test-utils.js';
import * as stories from './IconButton.stories';

const { Primary } = composeStories(stories);

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
});
