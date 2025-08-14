import { fireEvent, render, screen } from 'src/test-utils.js';

import { composeStories } from '@storybook/react';
import * as stories from './Dialog.stories';

const { Default, NoButton, WithCancelButton } = composeStories(stories);

describe('Dialog component', () => {
    it('should render a dialog if isOpen', () => {
        const onClick = jest.fn();
        const onClose = jest.fn();
        render(<Default onClose={onClose} onClick={onClick} />);

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Dialog Title')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Description goes here. Try to keep message to not more than three lines.',
            ),
        ).toBeInTheDocument();
        const button = screen.getByTestId('dialog-action-button');
        expect(button).toHaveTextContent('Ok');
        fireEvent.click(button);
        expect(onClick).toHaveBeenCalled();
    });

    it('should display the button at the bottom of the modal in full width', () => {
        render(<Default />);
        expect(screen.getByTestId('dialog-action-button')).toHaveClass(
            'w-full',
        );
    });

    it('should not display the button in the modal if callToAction is empty', () => {
        render(<NoButton />);
        expect(screen.queryByTestId('dialog-action-button')).toBeNull();
    });

    it('should disable the action button if disableActionButton is true', () => {
        render(<Default disableActionButton={true} />);
        expect(screen.getByTestId('dialog-action-button')).toBeDisabled();
    });

    it('should not disable the action button if disableActionButton is false', () => {
        render(<Default disableActionButton={false} />);
        expect(screen.getByTestId('dialog-action-button')).not.toBeDisabled();
    });

    it('should show cancel button when showCancelButton is true', () => {
        render(<WithCancelButton />);
        expect(
            screen.getByRole('button', { name: 'Cancel' }),
        ).toBeInTheDocument();
    });

    it('should not show cancel button when showCancelButton is false', () => {
        render(<Default />);
        expect(
            screen.queryByRole('button', { name: 'Cancel' }),
        ).not.toBeInTheDocument();
    });

    it('should call onClose when the cancel button is clicked', () => {
        const onClose = jest.fn();
        render(<WithCancelButton onClose={onClose} />);
        const cancelButton = screen.getByRole('button', { name: 'Cancel' });
        fireEvent.click(cancelButton);
        expect(onClose).toHaveBeenCalled();
    });
});
