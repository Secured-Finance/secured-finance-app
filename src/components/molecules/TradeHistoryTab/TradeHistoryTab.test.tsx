import { composeStories } from '@storybook/testing-react';
import { render, screen } from 'src/test-utils.js';
import * as stories from './TradeHistoryTab.stories';

const { Default } = composeStories(stories);

describe('TradeHistoryTab Component', () => {
    it('should render a TradeHistoryTab', () => {
        render(<Default />);
    });

    it('should render a TradeHistoryTab with 2 tabs', () => {
        render(<Default />);
        expect(screen.getAllByRole('tab')).toHaveLength(2);
    });

    it('should highlight the selected tab', () => {
        render(<Default />);
        expect(screen.getByRole('tab', { selected: true })).toHaveTextContent(
            'Active Contracts'
        );
        expect(
            screen.getByRole('button', { name: 'Active Contracts' })
        ).toHaveClass('bg-black-30');
        expect(
            screen.getByRole('button', { name: 'Trade History' })
        ).not.toHaveClass('bg-black-30');
        screen.getByText('Trade History').click();
        expect(screen.getByRole('tab', { selected: true })).toHaveTextContent(
            'Trade History'
        );
    });

    it('should display the content of the selected tab', () => {
        render(<Default />);
        expect(
            screen.getByText('This is a Great Tab Content')
        ).toBeInTheDocument();
        screen.getByText('Trade History').click();
        expect(
            screen.getByText('This is the content of the second tab')
        ).toBeInTheDocument();
    });
});
