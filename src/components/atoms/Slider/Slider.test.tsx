import { composeStories } from '@storybook/testing-react';
import { render } from 'src/test-utils.js';
import * as stories from './Slider.stories';

const { Default } = composeStories(stories);

describe('test Slider component', () => {
    it('should render Slider', () => {
        render(<Default />);
    });
});
