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
        render(
            <Default onClose={onClose} onClick={onClick}>
                <p style={{ color: 'white' }}>
                    This is the content but since it is a component, it can be
                    styled as we want
                </p>
            </Default>
        );

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Dialog Title')).toBeInTheDocument();
        expect(
            screen.getByText(
                'Description goes here. Try to keep message to not more than three lines.'
            )
        ).toBeInTheDocument();
        const button = screen.getByRole('button');
        expect(button).toHaveTextContent('Ok');
        fireEvent.click(button);
        expect(onClick).toHaveBeenCalled();
    });

    it('should display the button at the bottom of the modal in full width', () => {
        render(<Default />);
        expect(screen.getByRole('button')).toHaveClass('w-full');
    });

    it('should not display the button in the modal if callToAction is empty', () => {
        render(<NoButton />);
        expect(screen.queryByRole('button')).toBeNull();
    });
});
