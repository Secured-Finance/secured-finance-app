import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './OrderBookInfoTooltip.stories';

const { Default } = composeStories(stories);

describe('OrderBookInfoTooltip component', () => {
    it('should render order info tip ', () => {
        render(<Default />);
        expect(screen.getByText('Avg. Price (VWAP)')).toBeInTheDocument();
        expect(screen.getByText('1234.57')).toBeInTheDocument();
        expect(screen.getByText('Avg. APR')).toBeInTheDocument();
        expect(screen.getByText('1000.00%')).toBeInTheDocument();
        expect(screen.getByText('Total USDC')).toBeInTheDocument();
        expect(screen.getByText('1,089,890.89')).toBeInTheDocument();
        expect(screen.getByText('Total USD')).toBeInTheDocument();
        expect(screen.getByText('56.7K')).toBeInTheDocument();
    });
});
