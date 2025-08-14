import { composeStories } from '@storybook/react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './MarketTab.stories';

const { Default } = composeStories(stories);

describe('test Market Tab component', () => {
    it('should render Market Tab', () => {
        render(<Default />);
        expect(screen.getByLabelText('24h Volume')).toBeInTheDocument();
        expect(screen.getByText('24h Volume')).toBeInTheDocument();
        expect(screen.getByText('24h Volume')).toHaveClass(
            'laptop:typography-caption-2 whitespace-nowrap text-[11px] text-neutral-400',
        );
        expect(screen.getByText('10,000')).toBeInTheDocument();
        expect(screen.getByText('10,000')).toHaveClass(
            'typography-caption leading-4 text-neutral-50 desktop:leading-6 flex items-center',
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
