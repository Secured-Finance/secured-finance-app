import { composeStories } from '@storybook/testing-react';
import { render } from 'src/test-utils.js';
import * as stories from './GradientBox.stories';

const { Default } = composeStories(stories);

describe('GradientBox Component', () => {
    it('should render a GradientBox', () => {
        render(<Default />);
    });
});
