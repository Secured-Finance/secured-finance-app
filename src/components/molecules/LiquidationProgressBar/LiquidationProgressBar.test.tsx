import { composeStories } from '@storybook/testing-react';
import { render } from 'src/test-utils.js';
import * as stories from './LiquidationProgressBar.stories';

const { Default } = composeStories(stories);

describe('LiquidationProgressBar Component', () => {
    it('should render LiquidationProgressBar', () => {
        render(<Default />);
    });
});
