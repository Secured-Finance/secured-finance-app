import { composeStories } from '@storybook/testing-react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './TwoColumns.stories';

const { Default } = composeStories(stories);

describe('TwoColumns Component', () => {
    it('should render a TwoColumns', () => {
        render(<Default />);
    });

    it('should display two columns', () => {
        render(<Default />);
        expect(screen.getByText('Column 1')).toBeInTheDocument();
        expect(screen.getByText('Column 2')).toBeInTheDocument();
    });
});
