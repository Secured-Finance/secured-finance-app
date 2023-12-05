import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './Badge.stories';

const { Default } = composeStories(stories);

describe('Badge component', () => {
    it('should render Badge with correct icon and content', () => {
        render(<Default />);
        expect(screen.getByText('5')).toBeInTheDocument();
        expect(screen.getByTestId('notificationIcon')).toBeInTheDocument();
    });
});
