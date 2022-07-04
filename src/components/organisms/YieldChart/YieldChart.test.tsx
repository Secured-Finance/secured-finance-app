import { composeStories } from '@storybook/testing-react';
import { render } from 'src/test-utils.js';
import * as stories from './YieldChart.stories';

const { Default } = composeStories(stories);

describe('YieldChart Component', () => {
    it('should render YieldChart', async () => {
        render(<Default />);
    });
});
