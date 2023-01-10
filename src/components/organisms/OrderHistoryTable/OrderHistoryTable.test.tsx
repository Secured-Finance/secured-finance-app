import { composeStories } from '@storybook/testing-react';
import { render } from 'src/test-utils.js';
import * as stories from './OrderHistoryTable.stories';

const { Default } = composeStories(stories);

describe('OrderHistoryTable Component', () => {
    it('should render a TradeHistoryTable', () => {
        render(<Default />);
    });
});
