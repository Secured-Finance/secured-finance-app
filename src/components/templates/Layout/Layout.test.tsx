import { composeStories } from '@storybook/testing-react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './Layout.stories';

const { Default } = composeStories(stories);

describe('Layout Component', () => {
    it('should render a Skeleton', () => {
        render(<Default />);
    });

    it('should render with header, main and content', () => {
        render(
            <Default routes={[{ path: '/', component: <div>Content</div> }]} />
        );
        expect(screen.getByText('Content')).toBeInTheDocument();
        expect(screen.getByRole('banner')).toBeInTheDocument();
        expect(screen.getByRole('main')).toBeInTheDocument();
    });
});
