import { composeStories } from '@storybook/react';
import { preloadedBalance } from 'src/stories/mocks/fixtures';
import { render } from 'src/test-utils.js';
import * as stories from './CollateralOrganism.stories';

const { ConnectedToWallet } = composeStories(stories);

describe('CollateralOrganism Component', () => {
    it('should render CollateralOrganism', () => {
        render(<ConnectedToWallet />, { preloadedState: preloadedBalance });
    });
});
