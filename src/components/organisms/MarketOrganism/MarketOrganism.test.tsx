import { composeStories } from '@storybook/testing-react';
import { render } from 'src/test-utils.js';
import * as stories from './MarketOrganism.stories';

const { Default } = composeStories(stories);

describe('MarketOrganism Component', () => {
    it('should render MarketOrganism', () => {
        render(<Default />);
    });
});
