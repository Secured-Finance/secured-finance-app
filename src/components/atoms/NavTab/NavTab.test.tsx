import { composeStories } from '@storybook/testing-react';
import { fireEvent, render, screen } from 'src/test-utils.js';
import * as stories from './NavTab.stories';

const { Default, MarketDashboard } = composeStories(stories);

describe('NavTab component', () => {
    it('should render an active NavTab', () => {
        render(<Default />);
        const textElement = screen.getByText('OTC Lending');
        expect(textElement.parentNode).toHaveClass(
            'bg-gradient-to-b from-tabGradient2 to-tabGradient1'
        );
        expect(
            screen.getByTestId('OTC Lending-tab-button')
        ).toBeInTheDocument();
    });

    it('should render an inactive NavTab', () => {
        render(<MarketDashboard />);
        const textElement = screen.getByText('Market Dashboard');
        expect(textElement.parentNode).not.toHaveClass(
            'bg-gradient-to-b from-tabGradient2 to-tabGradient1'
        );
    });

    it('should call the onClick argument when clicked', () => {
        const onClick = jest.fn();
        render(<Default onClick={onClick} />);
        fireEvent.click(screen.getByRole('button'));
        expect(onClick).toHaveBeenCalled();
    });

    it('should render a div in place of button', () => {
        const onClick = jest.fn();
        render(<MarketDashboard onClick={onClick} />);
        expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });
});
