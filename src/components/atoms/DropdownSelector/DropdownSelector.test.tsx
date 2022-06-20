import { composeStories } from '@storybook/testing-react';
import { fireEvent, render, screen } from 'src/test-utils.js';
import * as stories from './DropdownSelector.stories';

const { AssetSelector, TermSelector } = composeStories(stories);

describe('Dropdown Asset Selection Component', () => {
    it('should render', () => {
        render(<AssetSelector />);
    });

    it('should render a clickable button', () => {
        render(<AssetSelector />);
        expect(screen.getByRole('button')).toBeInTheDocument();
    });

    it('should render a dropdown', () => {
        render(<AssetSelector />);
        fireEvent.click(screen.getByRole('button'));
        expect(screen.getByRole('menu')).toBeInTheDocument();
    });

    it('should have an arrow up when the dropdown is not visible, and an arrow down when the dropdown is visible', () => {
        render(<AssetSelector />);
        expect(screen.getByTestId('chevron-up-icon')).toBeInTheDocument();
        fireEvent.click(screen.getByRole('button'));
        expect(screen.getByTestId('chevron-down-icon')).toBeInTheDocument();
    });

    it('should change the button when a dropdown item is selected', () => {
        render(<AssetSelector />);
        fireEvent.click(screen.getByRole('button'));
        fireEvent.click(screen.getByText('Ethereum'));
        expect(screen.getByRole('button')).toHaveTextContent('Ethereum');
    });

    it('should render a term selector', () => {
        render(<TermSelector />);
        expect(screen.getByRole('button')).toBeInTheDocument();
    });
});
