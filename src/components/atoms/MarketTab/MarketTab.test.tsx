import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './MarketTab.stories';

const { Default, GreenMarketTab, GrayMarketTab } = composeStories(stories);

describe('test Market Tab component', () => {
    it('should render Market Tab', () => {
        render(<Default />);
        expect(screen.getByLabelText('24h Volume')).toBeInTheDocument();
        expect(screen.getByText('24h Volume')).toBeInTheDocument();
        expect(screen.getByText('24h Volume')).toHaveClass(
            'laptop:typography-caption-2 whitespace-nowrap text-[11px] text-neutral-400'
        );
        expect(screen.getByText('10,000')).toBeInTheDocument();
        expect(screen.getByText('10,000')).toHaveClass(
            'typography-caption leading-4 text-neutral-50 desktop:leading-6 flex items-center'
        );
    });

    it('should render Green Market Tab', () => {
        render(<GreenMarketTab />);
        expect(screen.getByLabelText('Green Market Tab')).toBeInTheDocument();
        expect(screen.getByText('7977.00')).toBeInTheDocument();
        expect(screen.getByText('7977.00')).toHaveClass(
            'whitespace-nowrap text-base font-semibold leading-[1.57] text-nebulaTeal'
        );
        expect(screen.getByText('25.00% APR')).toBeInTheDocument();
        expect(screen.getByText('25.00% APR')).toHaveClass(
            'whitespace-nowrap text-[11px] text-white flex items-center'
        );
    });

    it('should render Gray Market Tab', () => {
        render(<GrayMarketTab />);
        expect(screen.getByLabelText('Gray Market Tab')).toBeInTheDocument();
        expect(screen.getByText('7977.00')).toBeInTheDocument();
        expect(screen.getByText('7977.00')).toHaveClass(
            'typography-button-3 whitespace-nowrap leading-8 text-slateGray'
        );
        expect(screen.getByText('25.00% APR')).toBeInTheDocument();
        expect(screen.getByText('25.00% APR')).toHaveClass(
            'typography-caption text-slateGray'
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
