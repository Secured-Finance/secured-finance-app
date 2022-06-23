import { composeStories } from '@storybook/testing-react';
import { render } from 'src/test-utils.js';
import * as stories from './Landing.stories';

const { Default } = composeStories(stories);

describe('Landing Component', () => {
    it('should render a Landing', () => {
        render(<Default />);
    });
});
