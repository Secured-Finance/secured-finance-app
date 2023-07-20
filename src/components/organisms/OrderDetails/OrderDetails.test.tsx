import { composeStories } from '@storybook/react';
import { render } from 'src/test-utils.js';
import * as stories from './OrderDetails.stories';

const { Default } = composeStories(stories);

describe('OrderDetails Component', () => {
    it('should render order details', () => {
        render(<Default />);
    });
});
