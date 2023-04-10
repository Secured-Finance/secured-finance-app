import { render, screen } from 'src/test-utils.js';

import { composeStories } from '@storybook/testing-react';
import * as stories from './MenuItem.stories';

const { Default } = composeStories(stories);

describe('MenuItem component', () => {
    it('should render with correct text', async () => {
        render(<Default />);
        expect(screen.getByText('Example')).toBeInTheDocument();
    });

    it('should have the correct href attribute', async () => {
        render(<Default />);
        expect(screen.getByText('Example')).toBeInTheDocument();
        expect(screen.getByRole('link')).toHaveAttribute(
            'href',
            'https://secured.finance/'
        );
    });
});
