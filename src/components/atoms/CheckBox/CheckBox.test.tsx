import { composeStories } from '@storybook/react';
import { fireEvent, render, screen, waitFor } from 'src/test-utils.js';
import * as stories from './CheckBox.stories';

const { Default } = composeStories(stories);

describe('CheckBox Component', () => {
    it('should render a CheckBox', () => {
        render(<Default />);
    });

    it('should call handleToggle with correct values when toggled', async () => {
        const handleToggle = jest.fn();
        render(<Default handleToggle={handleToggle} />);

        const checkbox = screen.getByRole('checkbox');
        expect(checkbox).not.toBeChecked();
        await waitFor(() => {
            fireEvent.click(checkbox);
        });
        expect(checkbox).toBeChecked();
        expect(handleToggle).toHaveBeenCalledTimes(1);
        expect(handleToggle).toHaveBeenCalledWith(true);
        await waitFor(() => {
            fireEvent.click(checkbox);
        });
        expect(handleToggle).toHaveBeenCalledTimes(2);
        expect(handleToggle).toHaveBeenCalledWith(false);
    });
});
