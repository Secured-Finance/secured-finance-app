import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './Layout.stories';

const { Default } = composeStories(stories);

describe('Layout Component', () => {
    it('should render a Skeleton', () => {
        render(<Default />);
    });

    it('should render with header, main, footer and content', () => {
        render(
            <Default>
                <div>Content</div>
            </Default>
        );
        expect(screen.getByText('Content')).toBeInTheDocument();
        expect(screen.getByRole('banner')).toBeInTheDocument();
        expect(screen.getByRole('main')).toBeInTheDocument();
        expect(screen.getByRole('contentinfo')).toBeInTheDocument();
    });
});
