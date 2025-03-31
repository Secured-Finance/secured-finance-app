import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './OrderBookInfoTooltip.stories';

const { Default } = composeStories(stories);

describe('OrderDisplayBox component', () => {
    it('should render order info tip ', () => {
        render(<Default />);
        expect(screen.getByText('Avg. Price (VWAP):')).toBeInTheDocument();
        expect(screen.getByText('1234.57')).toBeInTheDocument();
    });
});
