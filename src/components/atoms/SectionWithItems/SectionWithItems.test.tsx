import { composeStories } from '@storybook/testing-react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './SectionWithItems.stories';

const { Default } = composeStories(stories);

describe('SectionWithItems Component', () => {
    it('should render a SectionWithItems', () => {
        render(<Default />);
    });

    it('should contain 2 rows of label and value', () => {
        render(<Default />);
        expect(screen.getByText('Label A')).toBeInTheDocument();
        expect(screen.getByText('Value A')).toBeInTheDocument();

        expect(screen.getByText('Label B')).toBeInTheDocument();
        expect(screen.getByText('Value B')).toBeInTheDocument();
    });
});
