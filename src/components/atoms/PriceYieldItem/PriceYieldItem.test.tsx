import { composeStories } from '@storybook/testing-react';
import { render } from 'src/test-utils.js';
import * as stories from './PriceYieldItem.stories';

const { Default } = composeStories(stories);

describe('PriceYieldItem Component', () => {
    it('should render a PriceYieldItem', () => {
        render(<Default />);
    });
});
