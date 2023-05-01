import { composeStories } from '@storybook/testing-react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './FailurePanel.stories';

const { Default, LongErrorMessage } = composeStories(stories);

describe('FailurePanel Component', () => {
    it('should render a FailurePanel', () => {
        render(<Default />);
        expect(screen.getByText('This is an error.')).toBeInTheDocument();
    });

    it('should render a long message failure panel', () => {
        render(<LongErrorMessage />);
        expect(
            screen.getByText(
                'This is an example of a Long Error Message. This message should enable horizontal scrollbar.'
            )
        ).toBeInTheDocument();
    });
});
