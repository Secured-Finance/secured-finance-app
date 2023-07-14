import { composeStories } from '@storybook/react';
import { fireEvent, render, screen } from 'src/test-utils.js';
import * as stories from './FailurePanel.stories';

const { Default, LongErrorMessage } = composeStories(stories);

Object.assign(navigator, {
    clipboard: {
        writeText: () => {},
    },
});

describe('FailurePanel Component', () => {
    it('should render a failure panel', () => {
        render(<Default />);
        expect(screen.getByText('Error Details')).toBeInTheDocument();
        expect(screen.getByRole('button')).toBeInTheDocument();
        expect(screen.getByText('Copy')).toBeInTheDocument();
        expect(screen.getByText('This is an error.')).toBeInTheDocument();
    });

    it('should render copy button with appropriate on click behaviour', () => {
        render(<Default />);
        jest.spyOn(navigator.clipboard, 'writeText');
        expect(screen.getByRole('button')).toBeInTheDocument();
        expect(screen.getByText('Copy')).toBeInTheDocument();
        const copyButton = screen.getByRole('button');
        fireEvent.click(copyButton);
        expect(screen.getByText('Copied!')).toBeInTheDocument();
        expect(navigator.clipboard.writeText).toHaveBeenCalledWith(
            'This is an error.'
        );
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
