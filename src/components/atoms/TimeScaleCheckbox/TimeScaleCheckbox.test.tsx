import { composeStories } from '@storybook/react';
import userEvent from '@testing-library/user-event';
import { render, screen } from 'src/test-utils.js';
import * as stories from './TimeScaleCheckbox.stories';

const { Default } = composeStories(stories);

describe('TimeScaleCheckBox Component', () => {
    it('should render the default checkbox component', () => {
        render(<Default />);
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toBeInTheDocument();
    });

    it('should render as checked when isChecked is true', () => {
        render(<Default isChecked />);
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toBeChecked();
    });

    it('should render as unchecked when isChecked is false', () => {
        render(<Default isChecked={false} />);
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).not.toBeChecked();
    });

    it('should call onChange when clicked', async () => {
        const handleChange = jest.fn();
        render(<Default isChecked={false} onChange={handleChange} />);
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).not.toBeChecked();

        await userEvent.click(checkbox);
        expect(handleChange).toHaveBeenCalledWith(true);
        expect(checkbox).toBeChecked();
    });

    it('should call onChange when clicking on the label', async () => {
        const handleChange = jest.fn();
        render(
            <Default isChecked={false} onChange={handleChange} label='Label' />
        );
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).not.toBeChecked();

        const label = screen.getByText('Label');
        await userEvent.click(label);
        expect(handleChange).toHaveBeenCalledWith(true);
        expect(checkbox).toBeChecked();
    });

    it('should be disabled and not call onChange when clicked', async () => {
        const handleChange = jest.fn();
        render(<Default isChecked={false} onChange={handleChange} disabled />);
        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).toBeDisabled();

        await userEvent.click(checkbox);
        expect(handleChange).not.toHaveBeenCalled();
    });
});
