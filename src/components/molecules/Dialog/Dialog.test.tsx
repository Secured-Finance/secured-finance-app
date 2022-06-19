import { fireEvent, render, screen } from 'src/test-utils.js';

import { composeStories } from '@storybook/testing-react';
import * as stories from './Dialog.stories';

const { Default, NoButton } = composeStories(stories);

// @ts-expect-error: this is a mock for the IntersectionObserver.
global.IntersectionObserver = class FakeIntersectionObserver {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    observe() {}
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    disconnect() {}
};

describe('Dialog component', () => {
    it('should render a dialog if isOpen', () => {
        const onClick = jest.fn();
        const onClose = jest.fn();
        render(<Default onClose={onClose} onClick={onClick} />);

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Dialog Title')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Description goes here. Try to keep message to not more than three lines.'
            )
        ).toBeInTheDocument();
        const button = screen.getByTestId('dialog-action-button');
        expect(button).toHaveTextContent('Ok');
        fireEvent.click(button);
        expect(onClick).toHaveBeenCalled();
    });

    it('should display the button at the bottom of the modal in full width', () => {
        render(<Default />);
        expect(screen.getByTestId('dialog-action-button')).toHaveClass(
            'w-full'
        );
    });

    it('should call onClose when the close button is clicked', () => {
        const onClose = jest.fn();
        render(<Default onClose={onClose} />);
        fireEvent.click(screen.getByTestId('close-button'));
        expect(onClose).toHaveBeenCalled();
    });

    it('should not display the button in the modal if callToAction is empty', () => {
        render(<NoButton />);
        expect(screen.queryByTestId('dialog-action-button')).toBeNull();
    });
});
