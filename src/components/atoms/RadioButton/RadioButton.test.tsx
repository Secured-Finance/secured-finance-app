import { composeStories } from '@storybook/react';
import { fireEvent, render, screen } from 'src/test-utils.js';
import * as stories from './RadioButton.stories';
const { Default } = composeStories(stories);

describe('RadioButton component', () => {
    it('should render a RadioButton', () => {
        render(<Default />);
    });

    it('should render options', () => {
        render(<Default />);

        expect(screen.getByTestId('Option 1')).toBeInTheDocument();
        expect(screen.getByTestId('Option 2')).toBeInTheDocument();
    });

    it('should call onChange when option clicked', () => {
        const onChange = jest.fn();
        render(<Default onChange={onChange} />);

        fireEvent.click(screen.getByTestId('Option 2'));
        expect(onChange).toHaveBeenCalledWith('option2');
    });

    it('should apply active styles to selected option', () => {
        render(<Default />);

        const defaultOption = screen.getByTestId('Option 1');
        const selectedOption = screen.getByTestId('Option 2');

        expect(defaultOption).toHaveClass('border-starBlue');
        expect(selectedOption).not.toHaveClass('border-starBlue');

        fireEvent.click(selectedOption);

        expect(defaultOption).not.toHaveClass('border-starBlue');
        expect(selectedOption).toHaveClass('border-starBlue');
    });
});
