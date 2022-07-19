import { composeStories } from '@storybook/testing-react';
import { fireEvent, render, screen } from 'src/test-utils.js';
import * as stories from './PercentageSelector.stories';

const { Default } = composeStories(stories);

describe('PercentageSelector component', () => {
    it('should render PercentageSelector', () => {
        const onClick = jest.fn();
        render(<Default onClick={onClick} />);
        const button = screen.getByTestId('25');
        expect(onClick).not.toHaveBeenCalled();
        fireEvent.click(button);
        expect(button).toHaveClass('border-none bg-neutral-8 text-neutral-2');
        expect(onClick).toHaveBeenCalled();
    });
});
