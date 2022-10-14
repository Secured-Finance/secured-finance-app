import { composeStories } from '@storybook/testing-react';
import { fireEvent, render, screen } from 'src/test-utils.js';
import * as stories from './InformationPopover.stories';

const { Default } = composeStories(stories);

describe('InformationPopover Component', () => {
    it('should render an InformationPopover', () => {
        render(<Default />);
        expect(screen.getByRole('button')).toBeInTheDocument();
        expect(screen.getByTestId('information-circle')).toBeInTheDocument();
    });

    it('should render information on mouseEnter event', () => {
        render(<Default />);
        const information = screen.getByTestId('information-circle');
        fireEvent.mouseEnter(information);

        expect(
            screen.getByText('You are currently at 43% to liquidation.')
        ).toBeInTheDocument();
    });

    it('should remove rendered information on mouseOut event', () => {
        render(<Default />);
        const information = screen.getByTestId('information-circle');
        fireEvent.mouseEnter(information);
        fireEvent.mouseOut(information);

        expect(
            screen.queryByText('You are currently at 43% to liquidation.')
        ).not.toBeInTheDocument();
    });
});
