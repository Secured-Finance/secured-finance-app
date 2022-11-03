import { composeStories } from '@storybook/testing-react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './TableHeader.stories';

const { Default } = composeStories(stories);

describe('TableHeader Component', () => {
    it('should render a TableHeader', () => {
        render(<Default />);
    });

    it('should be clickable', () => {
        render(<Default />);
        const button = screen.getByRole('button');
        expect(button).toBeInTheDocument();
    });
});
