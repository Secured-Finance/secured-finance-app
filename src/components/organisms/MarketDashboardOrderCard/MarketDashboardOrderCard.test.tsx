import { composeStories } from '@storybook/testing-react';
import { render } from 'src/test-utils.js';
import * as stories from './MarketDashboardOrderCard.stories';

const { Default } = composeStories(stories);

describe('MarketDashboardOrderCard Component', () => {
    it('should render a MarketDashboardOrderCard', () => {
        render(<Default />);
    });
});
