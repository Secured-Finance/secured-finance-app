import { composeStories } from '@storybook/testing-react';
import { render } from 'src/test-utils.js';
import * as stories from './GradientBox.stories';

const { Default, Rectangle } = composeStories(stories);

describe('GradientBox Component', () => {
    it('should render a GradientBox', () => {
        render(<Default />);
    });

    it('should render a solid rectangle GradientBox', () => {
        render(<Rectangle />);
    });
});
