import { composeStories } from '@storybook/react';
import { fireEvent, render, screen } from 'src/test-utils.js';
import * as stories from './Tab.stories';

const { Default, WithUtils } = composeStories(stories);

describe('Tab component', () => {
    it('should render all Tabs', () => {
        render(<Default />);
        expect(screen.getByRole('tablist')).toBeInTheDocument();
        expect(screen.getAllByRole('tab')).toHaveLength(3);
        expect(screen.getByText('Tab A')).toBeInTheDocument();
        expect(screen.getByText('Tab B')).toBeInTheDocument();
        expect(screen.getByText('Tab C')).toBeInTheDocument();
    });

    it('should render Tab A as the active tab and display the content', () => {
        render(<Default />);
        const tab = screen.getAllByRole('tab')[0];
        expect(tab.getAttribute('aria-selected')).toBe('true');
        expect(screen.getByText('Tab A Content')).toBeInTheDocument();
    });

    it('should render Tab B as the active tab and display the content when clicked', () => {
        render(<Default />);
        const tab = screen.getAllByRole('tab')[1];
        expect(tab.getAttribute('aria-selected')).toBe('false');
        fireEvent.click(tab);
        expect(tab.getAttribute('aria-selected')).toBe('true');
        expect(screen.getByText('Tab B Content')).toBeInTheDocument();
    });

    it('should not render Tab C when clicked because it is disabled', () => {
        render(<Default />);
        const tab = screen.getAllByRole('tab')[2];
        expect(tab.getAttribute('aria-selected')).toBe('false');
        fireEvent.click(tab);
        expect(tab.getAttribute('aria-selected')).toBe('false');
        expect(screen.getByText('Tab A Content')).toBeInTheDocument();
    });

    it('should render utils of the selected tab when provided', () => {
        render(<WithUtils />);

        expect(screen.getByText('Tab A Content')).toBeInTheDocument();
        expect(screen.getAllByText('Util A')).toHaveLength(2);
        const tab = screen.getAllByRole('tab')[1];
        fireEvent.click(tab);
        expect(screen.getByText('Tab B Content')).toBeInTheDocument();
        expect(screen.getByText('Util B')).toBeInTheDocument();
    });
});
