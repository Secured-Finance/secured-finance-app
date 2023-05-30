import { composeStories } from '@storybook/testing-react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './Closable.stories';

const { Default } = composeStories(stories);

describe('Closable Component', () => {
    it('should show a close button', () => {
        render(<Default />);
    });

    it('should call the onClose function when clicking on the close button', () => {
        const onClose = jest.fn();
        render(<Default onClose={onClose} />);
        expect(onClose).not.toHaveBeenCalled();
        screen.getByRole('button', { name: 'Close' }).click();
        expect(onClose).toHaveBeenCalled();
    });
});
