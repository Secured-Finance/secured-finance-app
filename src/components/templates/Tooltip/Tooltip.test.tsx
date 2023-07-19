import { composeStories } from '@storybook/react';
import { fireEvent, render, screen } from 'src/test-utils.js';
import * as stories from './Tooltip.stories';

const { Default } = composeStories(stories);

describe('Tooltip Component', () => {
    it('should render a Tooltip', () => {
        render(<Default />);
    });

    it('should render information on mouseEnter event', () => {
        render(<Default />);
        const information = screen.getByTestId('button-icon');
        fireEvent.mouseEnter(information);

        expect(screen.getByTestId('information-popover')).toBeInTheDocument();
        expect(screen.getByText('Tooltip content')).toBeInTheDocument();
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    it('should remove rendered information on mouseOut event', () => {
        render(<Default />);
        const information = screen.getByTestId('button-icon');
        fireEvent.mouseEnter(information);
        fireEvent.mouseOut(information);

        expect(screen.queryByText('Tooltip content')).not.toBeInTheDocument();
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
});
