import { composeStories } from '@storybook/testing-react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './MarketTab.stories';

const { Default, GreenMarketTab } = composeStories(stories);

describe('test Market Tab component', () => {
    it('should render Market Tab', () => {
        render(<Default />);
        expect(screen.getByLabelText('24h Volume')).toBeInTheDocument();
        expect(screen.getByText('24h Volume')).toBeInTheDocument();
        expect(screen.getByText('24h Volume')).toHaveClass(
            'typography-caption-2 text-slateGray'
        );
        expect(screen.getByText('10,000')).toBeInTheDocument();
        expect(screen.getByText('10,000')).toHaveClass(
            'typography-caption text-neutral-8'
        );
    });

    it('should render Green Market Tab', () => {
        render(<GreenMarketTab />);
        expect(screen.getByLabelText('Green Market Tab')).toBeInTheDocument();
        expect(screen.getByText('7977.00')).toBeInTheDocument();
        expect(screen.getByText('7977.00')).toHaveClass(
            'typography-button-3 leading-7 text-nebulaTeal'
        );
        expect(screen.getByText('25.00% APR')).toBeInTheDocument();
        expect(screen.getByText('25.00% APR')).toHaveClass(
            'typography-caption text-white'
        );
    });

    it('should override the default label with the label prop', () => {
        render(<Default label='Custom Label' />);
        expect(screen.getByLabelText('Custom Label')).toBeInTheDocument();
    });

    it('should not render source link if source is not provided', () => {
        render(<Default />);
        const source = screen.queryByRole('link');
        expect(source).not.toBeInTheDocument();
    });

    it('should render source link icon if source link is provided', () => {
        render(<Default source='https://secured.finance/' />);
        const source = screen.getByRole('link');
        expect(source).toBeInTheDocument();
        expect(source).toHaveAttribute('href', 'https://secured.finance/');
    });
});
