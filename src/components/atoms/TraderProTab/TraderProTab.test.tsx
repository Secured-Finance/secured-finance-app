import { composeStories } from '@storybook/react';
import { fireEvent, render, screen } from 'src/test-utils.js';
import * as stories from './TraderProTab.stories';

const { Default } = composeStories(stories);

describe('TraderProTab component', () => {
    it('should render a Tab', () => {
        render(<Default />);
        expect(screen.getByText('Trader Pro')).toBeInTheDocument();
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should call the onClick argument when clicked', () => {
        const onClick = jest.fn();
        render(<Default onClick={onClick} />);
        fireEvent.click(screen.getByRole('button'));
        expect(onClick).toHaveBeenCalled();
    });
});
