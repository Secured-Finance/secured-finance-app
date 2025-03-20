import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './OrderBookInfo.stories';

const { Default } = composeStories(stories);

describe('OrderDisplayBox component', () => {
    it('should render order info tip ', () => {
        render(<Default />);
        expect(screen.getByText('Avg. Price:')).toBeInTheDocument();
        expect(screen.getByText('1234.56')).toBeInTheDocument();
    });
});
