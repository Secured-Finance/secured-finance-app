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
        const information = screen.getByTestId('information-circle');
        fireEvent.mouseEnter(information);

        expect(screen.getByRole('tooltip')).toBeInTheDocument();
        expect(
            screen.getByText(
                'If the conditions are fulfilled, the trade will be executed.'
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
                'If the conditions are fulfilled, the trade will be executed.'
            )
        ).not.toBeInTheDocument();
        expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    });
});
