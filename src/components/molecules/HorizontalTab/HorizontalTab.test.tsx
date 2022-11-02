import { composeStories } from '@storybook/testing-react';
import { render, screen } from 'src/test-utils.js';
import { HorizontalTab } from './HorizontalTab';
import * as stories from './HorizontalTab.stories';

const { Default } = composeStories(stories);

describe('HorizontalTab Component', () => {
    it('should render a HorizontalTab', () => {
        render(<Default />);
    });

    it('should render a HorizontalTab with 2 tabs', () => {
        render(<Default />);
        expect(screen.getAllByRole('tab')).toHaveLength(2);
    });

    it('should highlight the selected tab', () => {
        render(<Default />);
        expect(screen.getByRole('tab', { selected: true })).toHaveTextContent(
            'Active Contracts'
        );
        expect(screen.getByText('Active Contracts')).toHaveClass('bg-black-30');
        expect(screen.getByText('Trade History')).not.toHaveClass(
            'bg-black-30'
        );
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

    it('should render the component even if it has no children', () => {
        render(<HorizontalTab tabTitles={[]}></HorizontalTab>);
        expect(screen.getByRole('tablist')).toBeInTheDocument();
    });
});
