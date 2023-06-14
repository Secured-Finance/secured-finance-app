import { fireEvent, render, screen } from 'src/test-utils.js';

import { composeStories } from '@storybook/testing-react';
import * as stories from './MenuPopover.stories';

const { Default } = composeStories(stories);

describe('MenuPopover component', () => {
    it('should have a button with text More...', () => {
        render(<Default />);
        const button = screen.getByRole('button', { name: 'More...' });
        expect(button).toBeInTheDocument();
    });
    it('should render when clicked on the More... button', () => {
        render(<Default />);
        expect(screen.queryByText('Official Site')).toBeNull();
        expect(screen.queryByText('Documentation')).toBeNull();
        expect(screen.queryByText('Follow us on Twitter')).toBeNull();
        expect(screen.queryByText('Join us on Discord')).toBeNull();
        fireEvent.click(screen.getByRole('button'));
        expect(screen.queryByText('Official Site')).toBeInTheDocument();
        expect(screen.queryByText('Documentation')).toBeInTheDocument();
        expect(screen.queryByText('Follow us on Twitter')).toBeInTheDocument();
        expect(screen.queryByText('Join us on Discord')).toBeInTheDocument();
    });
});
