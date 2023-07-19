import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './GradientBox.stories';

const { Default, Rectangle, Header } = composeStories(stories);

describe('GradientBox Component', () => {
    it('should render a GradientBox', () => {
        render(<Default />);
    });

    it('should render a solid rectangle GradientBox', () => {
        render(<Rectangle />);
    });

    it('should render a GradientBox with a header', () => {
        render(<Header />);
        expect(screen.getByText('Header')).toBeInTheDocument();
    });
});
