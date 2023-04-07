import { fireEvent, render, screen } from 'src/test-utils.js';

import { composeStories } from '@storybook/testing-react';
import * as stories from './MenuPopover.stories';

const { Default } = composeStories(stories);

describe('MenuPopover component', () => {
    it('should render when clicked on the More... button', () => {
        render(<Default />);
        expect(screen.queryByText('Secured Finance Landing Page')).toBeNull();
        expect(screen.queryByText('Documentation')).toBeNull();
        expect(screen.queryByText('Follow us on Twitter')).toBeNull();
        expect(screen.queryByText('Join us on discord')).toBeNull();
        fireEvent.click(screen.getByRole('button'));
        expect(
            screen.queryByText('Secured Finance landing page')
        ).toBeInTheDocument();
        expect(screen.queryByText('Documentation')).toBeInTheDocument();
        expect(screen.queryByText('Follow us on twitter')).toBeInTheDocument();
        expect(screen.queryByText('Join us on Discord')).toBeInTheDocument();
    });
});
