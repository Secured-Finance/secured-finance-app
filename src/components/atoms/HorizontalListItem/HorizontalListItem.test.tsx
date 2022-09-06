import { composeStories } from '@storybook/testing-react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './HorizontalListItem.stories';

const { Default } = composeStories(stories);

describe('HorizontalListItem Component', () => {
    it('should render a HorizontalListItem', () => {
        render(<Default />);
    });

    it('should contain a label and a value', () => {
        render(<Default />);
        expect(screen.getByText('Label')).toBeInTheDocument();
        expect(screen.getByText('Value')).toBeInTheDocument();
    });

    it('should align the label to the left and the value to the right', () => {
        render(<Default />);
        expect(screen.getByText('Label')).toHaveClass('text-left');
        expect(screen.getByText('Value')).toHaveClass('text-right');
    });
});
