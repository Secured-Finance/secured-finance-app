import { composeStories } from '@storybook/testing-react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './PortfolioTab.stories';

const { Default } = composeStories(stories);

describe('test Portfolio Tab component', () => {
    it('should render Portfolio Tab', () => {
        render(<Default />);
        expect(screen.getByText('Net APR')).toBeInTheDocument();
        expect(screen.getByText('$8.02')).toBeInTheDocument();
    });
});
