import { composeStories } from '@storybook/react';
import { render } from 'src/test-utils.js';
import * as stories from './NetworkSelector.stories';

const { Default } = composeStories(stories);

describe('Network Selector component', () => {
    it('should render component', async () => {
        render(<Default />);
    });
});
