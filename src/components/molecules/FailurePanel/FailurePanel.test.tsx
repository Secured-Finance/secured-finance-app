import { composeStories } from '@storybook/testing-react';
import { fireEvent, render, screen } from 'src/test-utils.js';
import * as stories from './FailurePanel.stories';

const { Default, LongErrorMessage } = composeStories(stories);

Object.assign(navigator, {
    clipboard: {
        writeText: () => {},
    },
});

describe('FailurePanel Component', () => {
    it('should render a FailurePanel', () => {
        render(<Default />);
        jest.spyOn(navigator.clipboard, 'writeText');
        expect(screen.getByRole('button')).toBeInTheDocument();
        const copyButton = screen.getByRole('button');
        fireEvent.click(copyButton);
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
            'This is an error.'
        );
        expect(screen.getByText('This is an error.')).toBeInTheDocument();
    });

    it('should render a long message failure panel', () => {
        render(<LongErrorMessage />);
        expect(
            screen.getByText(
                'This is an example of a Long Error Message. This message should enable vertical scrollbar. This is an example of a Long Error Message. This message should enable vertical scrollbar. This is an example of a Long Error Message. This message should enable vertical scrollbar.'
            )
        ).toBeInTheDocument();
    });
});
