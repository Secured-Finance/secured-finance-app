import { fireEvent, render, screen } from 'src/test-utils.js';

import { composeStories } from '@storybook/testing-react';
import * as stories from './Dialog.stories';

const { Primary } = composeStories(stories);

describe('Dialog component', () => {
    it('should render a dialog if isOpen', () => {
        const onClick = jest.fn();
        const onClose = jest.fn();
        render(
            <Primary onClose={onClose} onClick={onClick}>
                <p style={{ color: 'white' }}>
                    This is the content but since it is a component, it can be
                    styled as we want
                </p>
            </Primary>
        );

        expect(screen.getByRole('dialog')).toBeInTheDocument();
        expect(screen.getByText('Modal Title')).toBeInTheDocument();
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
});
