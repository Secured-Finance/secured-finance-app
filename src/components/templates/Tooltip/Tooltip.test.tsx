import { composeStories } from '@storybook/react';
import { fireEvent, render, screen } from 'src/test-utils.js';
import * as stories from './Tooltip.stories';

const { Default, OverrideIconColor } = composeStories(stories);

describe('Tooltip Component', () => {
    it('should render a Tooltip', () => {
        render(<Default />);
    });

    it('should render information on mouseEnter event', () => {
        render(<Default />);
        const information = screen.getByTestId('information-circle');
        fireEvent.mouseEnter(information);

        expect(screen.getByRole('tooltip')).toBeInTheDocument();
        expect(
            screen.getByText(
                'This is tooltip content. This is tooltip content.'
            )
        ).toBeInTheDocument();
        expect(screen.getByRole('tooltip')).toBeInTheDocument();
    });

    it('should remove rendered information on mouseLeave event', () => {
        render(<Default />);
        const information = screen.getByTestId('information-circle');
        fireEvent.mouseEnter(information);
        fireEvent.mouseLeave(information);

        expect(
            screen.queryByText(
                'This is tooltip content. This is tooltip content.'
            )
        ).not.toBeInTheDocument();
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });

    it('should override the color of the icon if specified', () => {
        render(<OverrideIconColor />);
        const information = screen.getByTestId('information-circle');
        expect(information).toHaveClass('text-orange');
    });
});
