import { composeStories } from '@storybook/testing-react';
import { render } from 'src/test-utils.js';
import * as stories from './PortfolioManagement.stories';

const { Default } = composeStories(stories);

describe('PortfolioManagement component', () => {
    it('should render PortfolioManagement', () => {
        render(<Default />);
    });
});
