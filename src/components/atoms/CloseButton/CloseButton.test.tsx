import { composeStories } from '@storybook/testing-react';
import { fireEvent, render, screen } from 'src/test-utils.js';
import * as stories from './CloseButton.stories';

const { Default } = composeStories(stories);

describe('CloseButton component', () => {
    it('should render a button', () => {
        render(<Default />);
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should call the onClick argument when clicked', () => {
        const onClick = jest.fn();
        render(<Default onClick={onClick} />);

        fireEvent.click(screen.getByRole('button'));
        expect(onClick).toHaveBeenCalled();
    });
});
