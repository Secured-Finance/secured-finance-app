import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './SimpleAdvancedView.stories';

const { Default } = composeStories(stories);

describe('SimpleAdvancedView Component', () => {
    it('should render a SimpleAdvancedView', () => {
        render(<Default />);
    });

    it('should display the advanced component by default', () => {
        render(<Default />);
        expect(screen.getByText('Advanced Component')).toBeInTheDocument();
    });

    it('should open on the simple view if the initialView is set to Simple', () => {
        render(<Default initialView='Simple' />);
        expect(screen.getByText('Simple Component')).toBeInTheDocument();
    });

    it('should open on the simple view by default', () => {
        render(<Default />);
        expect(screen.getByText('Advanced Component')).toBeInTheDocument();
    });
});
