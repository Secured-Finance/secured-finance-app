import { composeStories } from '@storybook/testing-react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './MarketTab.stories';

const { Default, GreenMarketTab } = composeStories(stories);

describe('test Market Tab component', () => {
    it('should render Market Tab', () => {
        render(<Default />);
        expect(screen.getByText('24h Volume')).toBeInTheDocument();
        expect(screen.getByText('24h Volume')).toHaveClass(
            'typography-caption-2 text-slateGray'
        );
        expect(screen.getByText('10,000')).toBeInTheDocument();
        expect(screen.getByText('10,000')).toHaveClass(
            'typography-caption font-medium text-neutral-8'
        );
    });

    it('should render Green Market Tab', () => {
        render(<GreenMarketTab />);
        expect(screen.getByText('7977.00')).toBeInTheDocument();
        expect(screen.getByText('7977.00')).toHaveClass(
            'typography-button-3 leading-7 text-proGreen'
        );
        expect(screen.getByText('25.00% APY')).toBeInTheDocument();
        expect(screen.getByText('25.00% APY')).toHaveClass(
            'typography-caption-2 font-semibold text-white'
        );
    });
});
