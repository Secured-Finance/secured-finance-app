import { composeStories } from '@storybook/react';
import { fireEvent, render, screen } from 'src/test-utils.js';
import * as stories from './SimpleAdvancedView.stories';

const { Default } = composeStories(stories);

describe('SimpleAdvancedView Component', () => {
    it('should render a SimpleAdvancedView', () => {
        render(<Default />);
    });

    it('should change the view when the user clicks on the selector', () => {
        render(<Default />);
        expect(screen.getByText('Simple')).toBeInTheDocument();
        expect(screen.getByText('Advanced')).toBeInTheDocument();
        fireEvent.click(screen.getByText('Simple'));
        expect(screen.getByText('Simple Component')).toBeInTheDocument();
        expect(
            screen.queryByText('Advanced Component')
        ).not.toBeInTheDocument();
        fireEvent.click(screen.getByText('Advanced'));
        expect(screen.getByText('Advanced Component')).toBeInTheDocument();
        expect(screen.queryByText('Simple Component')).not.toBeInTheDocument();
    });

    it('should call the onModeChange function when the user change the mode', () => {
        const onModeChange = jest.fn();
        render(<Default onModeChange={onModeChange} />);
        fireEvent.click(screen.getByText('Advanced'));
        expect(onModeChange).not.toHaveBeenCalled();
        fireEvent.click(screen.getByText('Simple'));
        expect(onModeChange).toHaveBeenCalled();
        fireEvent.click(screen.getByText('Advanced'));
        expect(onModeChange).toHaveBeenCalled();
    });

    it('should display the title', () => {
        render(<Default title='My Title' />);
        expect(screen.getByText('My Title')).toBeInTheDocument();
    });

    it('should display the advanced component by default', () => {
        render(<Default />);
        expect(screen.getByText('Advanced Component')).toBeInTheDocument();
    });

    it('should open on the simple view if the initialView is set to Simple', () => {
        render(<Default initialView='Simple' />);
        expect(screen.getByText('Simple Component')).toBeInTheDocument();
    });

    it('should open on the simple view by default', () => {
        render(<Default />);
        expect(screen.getByText('Advanced Component')).toBeInTheDocument();
    });

    it('should highlight the selected view', () => {
        render(<Default />);
        expect(screen.getByRole('radio', { name: 'Advanced' })).toBeChecked();
        expect(screen.getByRole('radio', { name: 'Simple' })).not.toBeChecked();
        fireEvent.click(screen.getByText('Simple'));
        expect(
            screen.getByRole('radio', { name: 'Advanced' })
        ).not.toBeChecked();
        expect(screen.getByRole('radio', { name: 'Simple' })).toBeChecked();
    });
});
