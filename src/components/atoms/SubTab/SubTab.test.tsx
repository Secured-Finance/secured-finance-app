import { composeStories } from '@storybook/react';

import { render, screen } from 'src/test-utils.js';
import * as stories from './SubTab.stories';

const { Default } = composeStories(stories);

describe('SubTab component', () => {
    it('should render text prop', () => {
        render(<Default />);

        expect(screen.getByText('Tab label')).toBeInTheDocument();
    });

    it('should apply active class when active prop is true', () => {
        render(<Default />);

        expect(screen.getByText('Tab label')).toHaveClass(
            'bg-primary-700 text-neutral-50',
        );
    });

    it('should apply inactive class when active prop is false', () => {
        render(<Default text='Test' active={false} />);

        expect(screen.getByText('Test')).toHaveClass('text-neutral-400');
    });
});
