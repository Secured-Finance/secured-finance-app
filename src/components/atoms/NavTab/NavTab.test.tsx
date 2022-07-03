import { composeStories } from '@storybook/testing-react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './NavTab.stories';

const { Default, MarketDashboard } = composeStories(stories);

describe('NavTab component', () => {
    it('should render an active NavTab', () => {
        render(<Default />);
        const textElement = screen.getByText('OTC Lending');
        expect(textElement.parentNode).toHaveClass(
            'bg-gradient-to-b from-tabGradient2 to-tabGradient1'
        );
    });

    it('should render an inactive NavTab', () => {
        render(<MarketDashboard />);
        const textElement = screen.getByText('Market Dashboard');
        expect(textElement.parentNode).not.toHaveClass(
            'bg-gradient-to-b from-tabGradient2 to-tabGradient1'
        );
    });
});
