import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './ErrorInfo.stories';

const { Default } = composeStories(stories);

describe('ErrorInfo Component', () => {
    it('should render an error text', () => {
        render(<Default />);
        expect(screen.getByText('This is an error')).toBeInTheDocument();
    });

    it('should not render an error text if showError is false', () => {
        render(<Default showError={false} />);
        expect(screen.queryByText('This is an error')).not.toBeInTheDocument();
    });
});
