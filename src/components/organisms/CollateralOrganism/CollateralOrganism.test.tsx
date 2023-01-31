import { composeStories } from '@storybook/testing-react';
import { preloadedBalances } from 'src/stories/mocks/fixtures';
import { render } from 'src/test-utils.js';
import * as stories from './CollateralOrganism.stories';

const { Default } = composeStories(stories);

describe('CollateralOrganism Component', () => {
    it('should render CollateralOrganism', () => {
        render(<Default />, { preloadedState: preloadedBalances });
    });
});
